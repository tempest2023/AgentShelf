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
import Card from "@/components/Card";

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
      <Card className="h-full p-0 overflow-hidden">
        <div className="border-b border-zinc-200 dark:border-zinc-800 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Bot className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {t("geo.agentCopilotTitle")}
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="h-3 w-3" />
                  CopilotKit
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {t("geo.agentCopilotSubtitle")}
              </p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                {t("geo.agentCopilotHint")}
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 pt-3">
          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 px-3 py-2.5 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {locale === "zh" ? "当前上下文" : "Current context"}
            </span>
            <span className="mx-2 text-zinc-300 dark:text-zinc-700">•</span>
            {selectedProduct.title}
          </div>
        </div>

        <div className="px-5 pt-3">
          <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.title}
                type="button"
                disabled={isSubmittingStarter}
                onClick={() => handleStarterPrompt(suggestion.message)}
                className="flex min-h-[168px] w-[220px] shrink-0 snap-start flex-col rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/60 disabled:cursor-wait disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                  {locale === "zh" ? "示例问题" : "Starter"}
                </div>
                <div className="mt-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {suggestion.title}
                </div>
                <div className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  {suggestion.message}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 pb-5 pt-3">
          <CopilotChat
            agentId={GEO_AGENT_ID}
            labels={{
              welcomeMessageText:
                locale === "zh"
                  ? "问我类目指标、当前商品表现，或 GEO 与 SEO 的差异。"
                  : "Ask for category metrics, product breakdowns, or GEO vs SEO deltas.",
              chatInputPlaceholder:
                locale === "zh"
                  ? "例如：比较电子产品和户外运动的 discoverability"
                  : "For example: Compare discoverability across Electronics and Outdoor",
            }}
            className="h-[560px] rounded-[22px] border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-950 md:h-[680px]"
          />
        </div>
      </Card>
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
    <div className="overflow-hidden rounded-[22px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {title}
            </h4>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          </div>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
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
          <div className="mt-4 rounded-2xl bg-blue-50 px-3 py-3 dark:bg-blue-500/8">
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
              className={`rounded-2xl border px-3 py-3 transition-colors ${
                item.id === activeDatumId
                  ? "border-blue-300 bg-blue-50/70 dark:border-blue-500/40 dark:bg-blue-500/6"
                  : "border-zinc-200 bg-zinc-50/80 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {item.label}
                  </div>
                  {item.note && (
                    <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
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
      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
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
      <div className="mb-1 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
        <span>{label}</span>
        <span>{value}</span>
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
