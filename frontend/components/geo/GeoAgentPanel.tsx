"use client";

import {
  useCallback,
  useMemo,
  useState,
  type ComponentProps,
} from "react";
import {
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotChatView,
  useAgent,
  useAgentContext,
  useCopilotKit,
  useFrontendTool,
  type ReactFrontendTool,
} from "@copilotkit/react-core/v2";
import { z } from "zod";
import type { Category, Product } from "@/lib/types";
import type { GeoChartPayload, GeoChartUnit } from "@/lib/geo-analytics";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";

const geoChartSchema = z.object({
  title: z.string(),
  description: z.string(),
  insight: z.string(),
  metricLabel: z.string(),
  unit: z.enum(["score", "percent", "currency", "visits", "count"]),
  primarySeriesLabel: z.string(),
  secondarySeriesLabel: z.string().optional(),
  higherIsBetter: z.boolean(),
  initialSort: z.enum(["asc", "desc"]),
  data: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      primaryValue: z.number(),
      secondaryValue: z.number().optional(),
      note: z.string().optional(),
      highlighted: z.boolean().optional(),
    })
  ),
});

const GEO_AGENT_ID = "geo_dashboard_agent";

const GEO_PLACEHOLDER_QUESTIONS: Record<
  "en" | "zh",
  Record<Category, string>
> = {
  en: {
    electronics:
      'For TechNova, what GEO signal is missing for "wireless earbuds for commuting"?',
    outdoor:
      'For Summit Trail, how does this SKU compare on "waterproof hiking backpack"?',
    pets:
      'For Paws & Whiskers, what schema or FAQ signal is missing for "interactive cat toys"?',
    health:
      'For VitalLife, how much GEO traffic uplift could "omega 3 supplement benefits" unlock?',
  },
  zh: {
    electronics: '锐科电子在“通勤降噪耳机”下还缺哪项 GEO 信号？',
    outdoor: '峰行户外这款商品在“防水徒步背包”下表现如何？',
    pets: '萌宠天地在“室内猫互动玩具”下缺少哪项 schema 或 FAQ？',
    health: '维他生活在“omega 3 补剂功效”下还能提升多少 GEO 流量？',
  },
};

const GEO_STARTER_CATEGORY_LABELS: Record<
  "en" | "zh",
  Record<Category, string>
> = {
  en: {
    electronics: "Electronics",
    outdoor: "Outdoor & Sports",
    pets: "Pet Supplies",
    health: "Health & Supplements",
  },
  zh: {
    electronics: "电子产品",
    outdoor: "户外运动",
    pets: "宠物用品",
    health: "保健品",
  },
};

type GeoAgentWelcomeScreenProps = ComponentProps<
  typeof CopilotChatView.WelcomeScreen
>;

export default function GeoAgentPanel({
  selectedProduct,
}: {
  selectedProduct: Product;
}) {
  const { agent } = useAgent({ agentId: GEO_AGENT_ID });
  const { copilotkit } = useCopilotKit();
  const { user } = useAuth();
  const { locale } = useLanguage();
  const [isSubmittingStarter, setIsSubmittingStarter] = useState(false);

  useAgentContext({
    description: "ui_locale",
    value: locale,
  });

  useAgentContext({
    description: "selected_product",
    value: {
      id: selectedProduct.id,
      title: selectedProduct.title,
      category: selectedProduct.category,
      brand: selectedProduct.brand,
      price: selectedProduct.price,
    },
  });

  useAgentContext({
    description: "store_context",
    value: {
      storeName: (locale === "zh" ? user?.storeNameZh : user?.storeName) ?? null,
      category: user?.category ?? null,
    },
  });

  const activeCategory = user?.category ?? selectedProduct.category;

  const suggestions = useMemo(
    () => {
      const categoryLabel =
        locale === "zh"
          ? GEO_STARTER_CATEGORY_LABELS.zh[activeCategory]
          : GEO_STARTER_CATEGORY_LABELS.en[activeCategory];

      return locale === "zh"
        ? [
            {
              message: "当前商品最弱的 GEO 维度是什么？",
            },
            {
              message: `${categoryLabel}类目里，哪些商品的可发现性最高？`,
            },
            {
              message: `${categoryLabel}类目在 GEO 优化后还有多少流量提升空间？`,
            },
          ]
        : [
            {
              message:
                "Which GEO dimension is weakest for the current product?",
            },
            {
              message: `Within ${categoryLabel}, which products lead on discoverability?`,
            },
            {
              message: `How much traffic uplift is available in ${categoryLabel} after GEO optimization?`,
            },
          ];
    },
    [activeCategory, locale]
  );

  const chatInputPlaceholder = useMemo(() => {
    return locale === "zh"
      ? GEO_PLACEHOLDER_QUESTIONS.zh[activeCategory]
      : GEO_PLACEHOLDER_QUESTIONS.en[activeCategory];
  }, [activeCategory, locale]);

  const handleStarterPrompt = useCallback(
    async (message: string) => {
      if (isSubmittingStarter) return;

      setIsSubmittingStarter(true);
      agent.addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: message,
      });

      try {
        await copilotkit.runAgent({ agent });
      } finally {
        setIsSubmittingStarter(false);
      }
    },
    [agent, copilotkit, isSubmittingStarter]
  );

  const welcomeScreen = useMemo(() => {
    function GeoAgentWelcomeScreen({
      input,
      className,
    }: GeoAgentWelcomeScreenProps) {
      return (
        <div className={`geo-agent-welcome-screen${className ? ` ${className}` : ""}`}>
          <div className="geo-agent-welcome-stack">
            <div
              className="geo-agent-starter-pills"
              aria-label={locale === "zh" ? "示例问题" : "Starter prompts"}
            >
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.message}
                  type="button"
                  disabled={isSubmittingStarter}
                  onClick={() => handleStarterPrompt(suggestion.message)}
                  aria-label={suggestion.message}
                  className="geo-agent-starter-pill"
                >
                  <span className="geo-agent-starter-pill-question">
                    {suggestion.message}
                  </span>
                </button>
              ))}
            </div>
            <div className="geo-agent-welcome-input">{input}</div>
          </div>
        </div>
      );
    }

    return GeoAgentWelcomeScreen;
  }, [handleStarterPrompt, isSubmittingStarter, locale, suggestions]);

  const chatView = useMemo(
    () => ({
      welcomeScreen,
      input: {
        className: "geo-agent-chat-input-shell",
        textArea: "geo-agent-chat-textarea",
        disclaimer: "geo-agent-chat-disclaimer",
        sendButton: "geo-agent-chat-send",
        addMenuButton: "geo-agent-chat-add",
      },
      messageView: {
        className: "geo-agent-message-view",
        assistantMessage: {
          className: "geo-agent-assistant-message",
          toolbar: "geo-agent-assistant-toolbar",
        },
        userMessage: {
          className: "geo-agent-user-message",
          messageRenderer: "geo-agent-user-bubble",
          toolbar: "geo-agent-user-toolbar",
        },
      },
    }),
    [welcomeScreen]
  );

  const geoChartTool: ReactFrontendTool<GeoChartPayload> = {
    agentId: GEO_AGENT_ID,
    name: "render_geo_chart",
    description: "Render an interactive GEO analytics chart inside the chat.",
    parameters: geoChartSchema,
    followUp: false,
    render: ({ args }) => {
      const parsed = geoChartSchema.safeParse(args);

      if (!parsed.success) {
        return (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
            {locale === "zh" ? "正在整理图表…" : "Preparing chart..."}
          </div>
        );
      }

      return <GeoAgentChartCard {...parsed.data} />;
    },
  };

  useFrontendTool(geoChartTool, [locale]);

  return (
    <CopilotChatConfigurationProvider agentId={GEO_AGENT_ID}>
      <div className="geo-agent-panel flex h-full min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-contain">
        <div className="geo-agent-compact-header border-b border-zinc-200/70 px-4 py-3 dark:border-zinc-800/80">
          <div className="geo-agent-context-bar">
            <span className="geo-agent-context-label">
              {locale === "zh" ? "当前商品" : "Current product"}
            </span>
            <span className="geo-agent-context-value">{selectedProduct.title}</span>
          </div>
        </div>

        <div data-sidebar-chat className="geo-agent-chat-shell flex min-h-0 w-full flex-1 flex-col">
          <CopilotChat
            agentId={GEO_AGENT_ID}
            chatView={chatView}
            labels={{
              chatInputPlaceholder,
              chatDisclaimerText:
                locale === "zh"
                  ? "AI 可能出错，请核对重要信息。"
                  : "AI can make mistakes. Please verify important information.",
            }}
            className="geo-agent-chat flex h-full min-h-0 flex-1 bg-transparent"
          />
        </div>
      </div>
    </CopilotChatConfigurationProvider>
  );
}

function GeoAgentChartCard({
  title,
  description,
  insight,
  metricLabel,
  unit,
  primarySeriesLabel,
  secondarySeriesLabel,
  higherIsBetter,
  initialSort,
  data,
}: GeoChartPayload) {
  const { locale } = useLanguage();
  const [seriesMode, setSeriesMode] = useState<"primary" | "secondary" | "both">(
    secondarySeriesLabel ? "both" : "primary"
  );
  const [sortMode, setSortMode] = useState<"asc" | "desc">(initialSort);
  const [activeDatumId, setActiveDatumId] = useState<string | null>(
    data.find((item) => item.highlighted)?.id ?? data[0]?.id ?? null
  );

  const numberLocale = locale === "zh" ? "zh-CN" : "en-US";

  const formattedData = useMemo(() => {
    const copied = [...data];

    copied.sort((left, right) => {
      const leftValue =
        seriesMode === "secondary" && left.secondaryValue !== undefined
          ? left.secondaryValue
          : left.primaryValue;
      const rightValue =
        seriesMode === "secondary" && right.secondaryValue !== undefined
          ? right.secondaryValue
          : right.primaryValue;

      return sortMode === "desc"
        ? rightValue - leftValue
        : leftValue - rightValue;
    });

    return copied;
  }, [data, seriesMode, sortMode]);

  const activeDatum =
    formattedData.find((item) => item.id === activeDatumId) ?? formattedData[0];

  const maxValue = Math.max(
    1,
    ...formattedData.flatMap((item) => {
      const values = [item.primaryValue];

      if (seriesMode !== "primary" && item.secondaryValue !== undefined) {
        values.push(item.secondaryValue);
      }

      return values;
    })
  );

  const sortLabel =
    locale === "zh"
      ? sortMode === "desc"
        ? higherIsBetter
          ? "从高到低"
          : "从低到高"
        : higherIsBetter
        ? "从低到高"
        : "从高到低"
      : sortMode === "desc"
      ? higherIsBetter
        ? "High to low"
        : "Low to high"
      : higherIsBetter
      ? "Low to high"
      : "High to low";

  return (
    <div className="overflow-hidden rounded-[24px] border border-zinc-200/90 bg-white/95 shadow-[0_20px_48px_-36px_rgba(15,23,42,0.35)] dark:border-zinc-800/90 dark:bg-zinc-950/90">
      <div className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
              {title}
            </h4>
            <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
            {metricLabel}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {secondarySeriesLabel && (
            <>
              <ToggleChip
                active={seriesMode === "both"}
                label={locale === "zh" ? "双视图" : "Both"}
                onClick={() => setSeriesMode("both")}
              />
              <ToggleChip
                active={seriesMode === "primary"}
                label={primarySeriesLabel}
                onClick={() => setSeriesMode("primary")}
              />
              <ToggleChip
                active={seriesMode === "secondary"}
                label={secondarySeriesLabel}
                onClick={() => setSeriesMode("secondary")}
              />
            </>
          )}
          {!secondarySeriesLabel && (
            <ToggleChip active label={primarySeriesLabel} onClick={() => {}} />
          )}
          <button
            type="button"
            onClick={() => setSortMode(sortMode === "desc" ? "asc" : "desc")}
            className="rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            {sortLabel}
          </button>
        </div>

        {activeDatum && (
          <div className="mt-4 rounded-[18px] border border-blue-200/70 bg-blue-50/80 px-3 py-3 dark:border-blue-500/20 dark:bg-blue-500/8">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="font-medium text-blue-700 dark:text-blue-300">
                {activeDatum.label}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-blue-700 dark:text-blue-300">
                <span>{formatChartValue(activeDatum.primaryValue, unit, numberLocale)}</span>
                {activeDatum.secondaryValue !== undefined && (
                  <span className="text-blue-500/80 dark:text-blue-300/80">
                    {secondarySeriesLabel}:{" "}
                    {formatChartValue(activeDatum.secondaryValue, unit, numberLocale)}
                  </span>
                )}
              </div>
            </div>
            {activeDatum.note && (
              <p className="mt-1 text-xs text-blue-700/80 dark:text-blue-300/80">
                {activeDatum.note}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3 px-4 py-4">
        {formattedData.map((item) => {
          const showPrimary = seriesMode === "primary" || seriesMode === "both";
          const showSecondary =
            item.secondaryValue !== undefined &&
            (seriesMode === "secondary" || seriesMode === "both");

          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onMouseEnter={() => setActiveDatumId(item.id)}
              onFocus={() => setActiveDatumId(item.id)}
              className={`rounded-[18px] border px-3 py-3 transition-colors ${
                item.id === activeDatumId
                  ? "border-blue-300 bg-blue-50/70 dark:border-blue-500/40 dark:bg-blue-500/6"
                  : "border-zinc-200 bg-zinc-50/80 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium leading-5 break-words text-zinc-800 dark:text-zinc-200">
                    {item.label}
                  </div>
                  {item.note && (
                    <div className="mt-0.5 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                      {item.note}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {showPrimary && (
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatChartValue(item.primaryValue, unit, numberLocale)}
                    </span>
                  )}
                  {showSecondary && item.secondaryValue !== undefined && (
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {formatChartValue(item.secondaryValue, unit, numberLocale)}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {showPrimary && (
                  <MetricBar
                    label={primarySeriesLabel}
                    value={item.primaryValue}
                    maxValue={maxValue}
                    color="bg-emerald-500"
                  />
                )}
                {showSecondary && item.secondaryValue !== undefined && (
                  <MetricBar
                    label={secondarySeriesLabel!}
                    value={item.secondaryValue}
                    maxValue={maxValue}
                    color="bg-blue-500"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-zinc-200 px-4 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        {insight}
      </div>
    </div>
  );
}

function ToggleChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`max-w-full rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
        active
          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
          : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
      }`}
    >
      {label}
    </button>
  );
}

function MetricBar({
  label,
  value,
  maxValue,
  color,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
        <span className="truncate">{label}</span>
        <span className="shrink-0">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className={`h-full rounded-full ${color} transition-[width] duration-300`}
          style={{ width: `${Math.max((value / maxValue) * 100, 6)}%` }}
        />
      </div>
    </div>
  );
}

function formatChartValue(
  value: number,
  unit: GeoChartUnit,
  locale: string
) {
  switch (unit) {
    case "percent":
      return `${value}%`;
    case "currency":
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 1,
      }).format(value);
    case "visits":
      return new Intl.NumberFormat(locale).format(value);
    case "count":
    case "score":
    default:
      return `${value}`;
  }
}
