"use client";

import {
  Activity,
  Bot,
  Radar,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GeoGeneratedPanelState } from "@/lib/geo-generated-panel";
import type { GeoChartPayload, GeoChartUnit } from "@/lib/geo-analytics";
import { useLanguage } from "@/lib/i18n/context";

const PANEL_EXIT_MS = 320;

type PanelVariant = "spotlight" | "leaderboard" | "opportunity";

export default function GeoGeneratedInsightPanel({
  panel,
  onClose,
}: {
  panel: GeoGeneratedPanelState;
  onClose: () => void;
}) {
  const { locale } = useLanguage();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const updateHeight = () => setHeight(element.offsetHeight);

    updateHeight();

    const observer = new ResizeObserver(() => updateHeight());
    observer.observe(element);

    return () => observer.disconnect();
  }, [panel.id, panel.status]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      onClose();
    }, PANEL_EXIT_MS);
  };

  return (
    <div
      className="overflow-hidden transition-[height,opacity,transform,margin] duration-300 ease-out"
      style={{
        height: isClosing ? 0 : height,
        opacity: isClosing ? 0 : 1,
        transform: isClosing ? "translateY(-8px) scale(0.985)" : "translateY(0) scale(1)",
      }}
    >
      <section
        ref={contentRef}
        className="overflow-hidden rounded-[30px] border border-zinc-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(255,255,255,0.98))] shadow-[0_34px_80px_-54px_rgba(15,23,42,0.42)] ring-1 ring-zinc-200/60 dark:border-zinc-800 dark:bg-[linear-gradient(180deg,rgba(24,24,27,0.98),rgba(9,9,11,0.98))] dark:ring-zinc-800/70"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200/80 px-5 py-5 dark:border-zinc-800/80">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <Bot className="h-3.5 w-3.5" />
              {locale === "zh" ? "GEO Agent 生成视图" : "GEO Agent Generated View"}
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-zinc-50">
              {panel.status === "generating"
                ? locale === "zh"
                  ? "正在把问题编织成一个可操作的 GEO 页面"
                  : "Composing a live GEO page from your question"
                : panel.chart?.title}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {panel.status === "generating"
                ? panel.query
                : panel.chart?.description || panel.query}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white/90 text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
            aria-label={locale === "zh" ? "关闭生成的 GEO 结果" : "Close generated GEO result"}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-5">
          {panel.status === "generating" || !panel.chart ? (
            <GeneratedLoadingBody query={panel.query} />
          ) : (
            <GeneratedReadyBody chart={panel.chart} query={panel.query} />
          )}
        </div>
      </section>
    </div>
  );
}

function GeneratedLoadingBody({ query }: { query: string }) {
  const { locale } = useLanguage();

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <div className="relative overflow-hidden rounded-[28px] border border-sky-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(186,230,253,0.95),_rgba(240,249,255,0.92)_42%,_rgba(236,253,245,0.92)_100%)] p-6 dark:border-sky-500/20 dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,116,144,0.32),_rgba(12,18,28,0.94)_42%,_rgba(6,95,70,0.22)_100%)]">
        <div className="absolute -right-6 top-6 h-28 w-28 rounded-full border border-sky-300/70 bg-white/30 animate-pulse dark:border-sky-400/20 dark:bg-sky-400/10" />
        <div className="absolute right-10 top-10 h-20 w-20 rounded-full border border-sky-400/60 animate-spin dark:border-sky-300/30" style={{ animationDuration: "10s" }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700 shadow-sm dark:bg-zinc-950/50 dark:text-sky-300">
            <Radar className="h-3.5 w-3.5" />
            {locale === "zh" ? "实时生成中" : "Live generation"}
          </div>
          <h4 className="mt-4 text-[1.65rem] font-semibold leading-tight tracking-[-0.045em] text-slate-900 dark:text-white">
            {locale === "zh"
              ? "把你的问题翻译成一个会自己落位的 Dashboard 面板。"
              : "Turning your question into a dashboard panel that can place itself."}
          </h4>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-sky-50/80">
            {query}
          </p>
        </div>
      </div>

      <div className="grid gap-3 rounded-[28px] border border-zinc-200/80 bg-zinc-50/75 p-5 dark:border-zinc-800 dark:bg-zinc-900/70">
        {[
          locale === "zh" ? "读取当前商品与店铺上下文" : "Reading current product and store context",
          locale === "zh" ? "匹配 GEO 指标与品类信号" : "Matching GEO metrics and category signals",
          locale === "zh" ? "组装可插入的结果页面" : "Composing the insertable result view",
        ].map((step, index) => (
          <div
            key={step}
            className="rounded-[22px] border border-zinc-200/80 bg-white/90 p-4 dark:border-zinc-800 dark:bg-zinc-950/80"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {step}
              </div>
              <Sparkles
                className="h-4 w-4 animate-pulse text-sky-500 dark:text-sky-300"
                style={{ animationDelay: `${index * 140}ms` }}
              />
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 animate-pulse"
                style={{
                  width: `${68 + index * 10}%`,
                  animationDelay: `${index * 160}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GeneratedReadyBody({
  chart,
  query,
}: {
  chart: GeoChartPayload;
  query: string;
}) {
  const { locale } = useLanguage();
  const variant = resolvePanelVariant(chart, query);
  const sortedData = useMemo(() => sortChartData(chart), [chart]);
  const lead = sortedData[0];
  const tail = sortedData[sortedData.length - 1];
  const averageValue = useMemo(
    () =>
      chart.data.length
        ? chart.data.reduce((sum, item) => sum + item.primaryValue, 0) / chart.data.length
        : 0,
    [chart.data]
  );

  if (variant === "spotlight") {
    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
        <div className="overflow-hidden rounded-[28px] border border-blue-200/80 bg-[linear-gradient(155deg,rgba(239,246,255,1),rgba(255,255,255,0.98),rgba(240,253,250,0.92))] p-6 dark:border-blue-500/20 dark:bg-[linear-gradient(155deg,rgba(30,41,59,0.95),rgba(9,9,11,0.98),rgba(15,23,42,0.95))]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-300">
                {locale === "zh" ? "当前问题" : "Prompt"}
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {query}
              </p>
            </div>
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white/85 dark:border-blue-400/20 dark:bg-zinc-950/60">
              <div className="absolute inset-2 rounded-full border border-blue-200/70 animate-pulse dark:border-blue-400/20" />
              <div className="text-center">
                <div className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950 dark:text-white">
                  {Math.round(averageValue)}
                </div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                  {locale === "zh" ? "平均" : "Avg"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <MetricCallout
              label={locale === "zh" ? "最强信号" : "Strongest signal"}
              value={lead?.label ?? chart.metricLabel}
              detail={
                lead
                  ? `${formatChartValue(lead.primaryValue, chart.unit, locale)}`
                  : chart.metricLabel
              }
            />
            <MetricCallout
              label={locale === "zh" ? "主要短板" : "Primary gap"}
              value={tail?.label ?? chart.metricLabel}
              detail={
                tail
                  ? `${formatChartValue(tail.primaryValue, chart.unit, locale)}`
                  : chart.metricLabel
              }
            />
          </div>

          <p className="mt-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {chart.insight}
          </p>
        </div>

        <GeoAgentChartCard {...chart} chrome="embedded" />
      </div>
    );
  }

  if (variant === "opportunity") {
    return (
      <div className="space-y-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
          <div className="overflow-hidden rounded-[28px] border border-emerald-200/80 bg-[linear-gradient(160deg,rgba(236,253,245,1),rgba(255,255,255,0.98),rgba(240,249,255,0.92))] p-6 dark:border-emerald-500/20 dark:bg-[linear-gradient(160deg,rgba(6,95,70,0.28),rgba(9,9,11,0.98),rgba(12,18,28,0.94))]">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:bg-zinc-950/50 dark:text-emerald-300">
              <TrendingUp className="h-3.5 w-3.5" />
              {locale === "zh" ? "增长机会" : "Opportunity signal"}
            </div>
            <div className="mt-5 flex items-end gap-4">
              <div className="text-[3.3rem] font-semibold leading-none tracking-[-0.08em] text-zinc-950 dark:text-white">
                {lead ? formatChartValue(lead.primaryValue, chart.unit, locale) : "0"}
              </div>
              <div className="pb-2 text-sm text-zinc-500 dark:text-zinc-400">
                {lead?.label ?? chart.metricLabel}
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              {chart.insight}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCallout
              label={locale === "zh" ? "样本数" : "Coverage"}
              value={`${chart.data.length}`}
              detail={locale === "zh" ? "可比较项" : "items compared"}
            />
            <MetricCallout
              label={locale === "zh" ? "平均值" : "Average"}
              value={formatChartValue(averageValue, chart.unit, locale)}
              detail={chart.metricLabel}
            />
            <MetricCallout
              label={locale === "zh" ? "尾部项" : "Trailing item"}
              value={tail?.label ?? "-"}
              detail={
                tail
                  ? formatChartValue(tail.primaryValue, chart.unit, locale)
                  : chart.metricLabel
              }
            />
          </div>
        </div>

        <GeoAgentChartCard {...chart} chrome="embedded" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_320px]">
        <div className="overflow-hidden rounded-[28px] border border-amber-200/80 bg-[linear-gradient(160deg,rgba(255,251,235,1),rgba(255,255,255,0.98),rgba(250,245,255,0.92))] p-6 dark:border-amber-500/20 dark:bg-[linear-gradient(160deg,rgba(120,53,15,0.22),rgba(9,9,11,0.98),rgba(30,27,75,0.92))]">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700 dark:bg-zinc-950/50 dark:text-amber-300">
            <Activity className="h-3.5 w-3.5" />
            {locale === "zh" ? "类目领跑板" : "Leaderboard"}
          </div>
          <h4 className="mt-4 text-[1.9rem] font-semibold leading-tight tracking-[-0.05em] text-zinc-950 dark:text-white">
            {locale === "zh"
              ? `${lead?.label ?? chart.metricLabel} 正在拉高这一组的 GEO 天花板。`
              : `${lead?.label ?? chart.metricLabel} is setting the pace for this GEO cluster.`}
          </h4>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            {chart.insight}
          </p>
        </div>

        <div className="rounded-[28px] border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
            {locale === "zh" ? "Top results" : "Top results"}
          </div>
          <div className="mt-3 space-y-2">
            {sortedData.slice(0, 3).map((item, index) => (
              <div
                key={item.id}
                className="rounded-[20px] border border-zinc-200/80 bg-white/90 px-3 py-3 dark:border-zinc-800 dark:bg-zinc-950/80"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                      0{index + 1}
                    </div>
                    <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {item.label}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatChartValue(item.primaryValue, chart.unit, locale)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <GeoAgentChartCard {...chart} chrome="embedded" />
    </div>
  );
}

function MetricCallout({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[22px] border border-zinc-200/80 bg-white/88 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950/75">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
        {value}
      </div>
      <div className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        {detail}
      </div>
    </div>
  );
}

function resolvePanelVariant(chart: GeoChartPayload, query: string): PanelVariant {
  const haystack = `${chart.title} ${chart.metricLabel} ${query}`.toLowerCase();

  if (
    haystack.includes("current product") ||
    haystack.includes("当前商品") ||
    haystack.includes("readiness") ||
    haystack.includes("就绪") ||
    chart.data.length === 1
  ) {
    return "spotlight";
  }

  if (
    haystack.includes("uplift") ||
    haystack.includes("lift") ||
    haystack.includes("提升") ||
    haystack.includes("traffic") ||
    haystack.includes("流量")
  ) {
    return "opportunity";
  }

  return "leaderboard";
}

function sortChartData(chart: GeoChartPayload) {
  const copied = [...chart.data];

  copied.sort((left, right) =>
    chart.initialSort === "desc"
      ? right.primaryValue - left.primaryValue
      : left.primaryValue - right.primaryValue
  );

  return copied;
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
  chrome = "standalone",
}: GeoChartPayload & {
  chrome?: "standalone" | "embedded";
}) {
  const { locale } = useLanguage();
  const [seriesMode, setSeriesMode] = useState<"primary" | "secondary" | "both">(
    secondarySeriesLabel ? "both" : "primary"
  );
  const [sortMode, setSortMode] = useState<"asc" | "desc">(initialSort);
  const [activeDatumId, setActiveDatumId] = useState<string | null>(
    data.find((item) => item.highlighted)?.id ?? data[0]?.id ?? null
  );

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

      return sortMode === "desc" ? rightValue - leftValue : leftValue - rightValue;
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
    <div
      className={`overflow-hidden rounded-[28px] border ${
        chrome === "embedded"
          ? "border-zinc-200/85 bg-white/86 dark:border-zinc-800/85 dark:bg-zinc-950/72"
          : "border-zinc-200/90 bg-white/95 shadow-[0_20px_48px_-36px_rgba(15,23,42,0.35)] dark:border-zinc-800/90 dark:bg-zinc-950/90"
      }`}
    >
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
          {secondarySeriesLabel ? (
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
          ) : (
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
                <span>{formatChartValue(activeDatum.primaryValue, unit, locale)}</span>
                {activeDatum.secondaryValue !== undefined && (
                  <span className="text-blue-500/80 dark:text-blue-300/80">
                    {secondarySeriesLabel}:{" "}
                    {formatChartValue(activeDatum.secondaryValue, unit, locale)}
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
                  <div className="break-words text-sm font-medium leading-5 text-zinc-800 dark:text-zinc-200">
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
                      {formatChartValue(item.primaryValue, unit, locale)}
                    </span>
                  )}
                  {showSecondary && item.secondaryValue !== undefined && (
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {formatChartValue(item.secondaryValue, unit, locale)}
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
  locale: "en" | "zh"
) {
  const numberLocale = locale === "zh" ? "zh-CN" : "en-US";

  switch (unit) {
    case "percent":
      return `${Number(value.toFixed(1))}%`;
    case "currency":
      return new Intl.NumberFormat(numberLocale, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 1,
      }).format(value);
    case "visits":
      return new Intl.NumberFormat(numberLocale).format(value);
    case "count":
    case "score":
    default:
      return `${Number(value.toFixed(1))}`;
  }
}
