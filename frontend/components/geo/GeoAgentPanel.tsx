"use client";

import { useCallback, useMemo, useState } from "react";
import {
  CopilotChat,
  CopilotChatConfigurationProvider,
  useAgent,
  useAgentContext,
  useCopilotKit,
  useFrontendTool,
  type ReactFrontendTool,
} from "@copilotkit/react-core/v2";
import { z } from "zod";
import { Bot, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
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

export default function GeoAgentPanel({
  selectedProduct,
}: {
  selectedProduct: Product;
}) {
  const { agent } = useAgent({ agentId: GEO_AGENT_ID });
  const { copilotkit } = useCopilotKit();
  const { user } = useAuth();
  const { locale, t } = useLanguage();
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

  const suggestions = useMemo(
    () =>
      locale === "zh"
        ? [
            {
              title: "看当前商品",
              message: "展示当前商品的 GEO readiness 图表，并指出最弱分项。",
            },
            {
              title: "比较类目分数",
              message: "比较电子产品和户外运动类目的 discoverability，并生成对比图。",
            },
            {
              title: "看流量提升",
              message: "用图表展示健康品类在 GEO 优化后的预计流量提升。",
            },
          ]
        : [
            {
              title: "Current product",
              message:
                "Show the GEO readiness chart for the current product and identify the weakest dimension.",
            },
            {
              title: "Compare categories",
              message:
                "Compare discoverability across Electronics and Outdoor & Sports in a chart.",
            },
            {
              title: "Traffic uplift",
              message:
                "Chart the expected traffic uplift for Health & Supplements after GEO optimization.",
            },
          ],
    [locale]
  );

  const chatView = useMemo(
    () => ({
      welcomeScreen: false,
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
    []
  );

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
      <div className="geo-agent-panel flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
        <div className="border-b border-zinc-200/70 px-4 py-4 dark:border-zinc-800/80 sm:px-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Bot className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="geo-agent-title-row flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-100">
                  {t("geo.agentCopilotTitle")}
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                  <Sparkles className="h-3 w-3" />
                  CopilotKit
                </span>
              </div>
              <p className="mt-2 max-w-[38ch] text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {t("geo.agentCopilotSubtitle")}
              </p>
              <div className="geo-agent-context mt-3 rounded-[20px] border border-zinc-200/80 bg-white/80 px-3 py-3 text-xs text-zinc-500 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.28)] backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/70 dark:text-zinc-400">
                <span className="font-medium uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                  {locale === "zh" ? "当前上下文" : "Current context"}
                </span>
                <span className="min-w-0 text-sm font-medium leading-5 text-zinc-700 dark:text-zinc-200">
                  {selectedProduct.title}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 max-w-[42ch] text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {t("geo.agentCopilotHint")}
          </p>
        </div>

        <div className="px-4 pb-4 pt-4 sm:px-5">
          <div className="geo-agent-starters grid auto-rows-fr gap-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.title}
                type="button"
                disabled={isSubmittingStarter}
                onClick={() => handleStarterPrompt(suggestion.message)}
                className="group flex min-h-[152px] flex-col rounded-[22px] border border-zinc-200/80 bg-white/92 px-3.5 py-3.5 text-left shadow-[0_18px_44px_-36px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/75 hover:shadow-[0_24px_50px_-34px_rgba(37,99,235,0.35)] disabled:cursor-wait disabled:opacity-60 dark:border-zinc-800/80 dark:bg-zinc-950/80 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 transition-colors group-hover:text-blue-500 dark:text-zinc-500 dark:group-hover:text-blue-400">
                  {locale === "zh" ? "示例问题" : "Starter"}
                </div>
                <div className="mt-3 text-sm font-semibold leading-5 text-zinc-900 dark:text-zinc-100">
                  {suggestion.title}
                </div>
                <div className="mt-2 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                  {suggestion.message}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-0 sm:px-5">
          <div
            data-sidebar-chat
            className="geo-agent-chat-shell flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[26px] border border-zinc-200/80 bg-white/92 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.4)] backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/88"
          >
            <CopilotChat
              agentId={GEO_AGENT_ID}
              chatView={chatView}
              labels={{
                welcomeMessageText:
                  locale === "zh"
                    ? "问我 GEO 指标、商品表现或类目对比。"
                    : "Ask about GEO metrics, product performance, or category deltas.",
                chatInputPlaceholder:
                  locale === "zh"
                    ? "例如：对比电子与户外类目的 discoverability"
                    : "For example: Compare Electronics vs Outdoor discoverability",
              }}
              className="geo-agent-chat flex h-full min-h-0 flex-1 bg-transparent"
            />
          </div>
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
