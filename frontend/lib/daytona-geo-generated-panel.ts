import "server-only";

import { Daytona } from "@daytona/sdk";
import { z } from "zod";
import type {
  GeoAgentLocale,
  GeoChartPayload,
  GeoChartUnit,
} from "@/lib/geo-analytics";
import type {
  GeoGeneratedExecutionArtifact,
  GeoGeneratedPanelToolPayload,
} from "@/lib/geo-generated-panel";
import type { Product } from "@/lib/types";

const RESULT_MARKER = "__AGENTSHELF_DAYTONA_PANEL__";
const DEFAULT_ENTRY_FILE = "inline/geo-generated-panel.ts";

const sandboxRenderResultSchema = z.object({
  title: z.string(),
  summary: z.string(),
  html: z.string(),
  warnings: z.array(z.string()).optional(),
  renderedAt: z.string(),
});

interface GeoGeneratedPanelPreviewRow {
  id: string;
  label: string;
  value: string;
  widthPercent: number;
  note?: string;
  highlighted: boolean;
}

interface GeoGeneratedPanelPreviewModel {
  locale: GeoAgentLocale;
  eyebrow: string;
  heroTitle: string;
  heroBody: string;
  chartTitle: string;
  chartDescription: string;
  insight: string;
  metricLabel: string;
  primarySeriesLabel: string;
  secondarySeriesLabel?: string;
  promptLabel: string;
  promptText: string;
  productLabel: string;
  productTitle: string;
  storeLabel: string;
  storeName: string;
  leadingLabel: string;
  leadingValue: string;
  trailingLabel: string;
  trailingValue: string;
  averageLabel: string;
  averageValue: string;
  footerText: string;
  rowsTitle: string;
  rows: GeoGeneratedPanelPreviewRow[];
  summary: string;
  warnings: string[];
}

interface ExecuteGeoGeneratedPanelParams {
  chart: GeoChartPayload;
  locale: GeoAgentLocale;
  query: string;
  selectedProduct?: Product | null;
  storeName?: string | null;
}

function isDaytonaConfigured() {
  return Boolean(process.env.DAYTONA_API_KEY?.trim());
}

function formatChartValue(
  value: number,
  unit: GeoChartUnit,
  locale: GeoAgentLocale
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildPreviewModel({
  chart,
  locale,
  query,
  selectedProduct,
  storeName,
}: ExecuteGeoGeneratedPanelParams): GeoGeneratedPanelPreviewModel {
  const ranked = [...chart.data].sort(
    (left, right) => right.primaryValue - left.primaryValue
  );
  const maxValue = Math.max(1, ...ranked.map((item) => item.primaryValue));
  const lead = ranked[0];
  const tail = ranked[ranked.length - 1];
  const average =
    ranked.length > 0
      ? ranked.reduce((sum, item) => sum + item.primaryValue, 0) / ranked.length
      : 0;
  const rows = ranked.slice(0, 5).map((item) => ({
    id: item.id,
    label: item.label,
    value: formatChartValue(item.primaryValue, chart.unit, locale),
    widthPercent: Math.max(12, Math.round((item.primaryValue / maxValue) * 100)),
    note: item.note,
    highlighted: Boolean(item.highlighted),
  }));

  const productTitle =
    selectedProduct?.title ??
    (locale === "zh" ? "当前商品" : "Current product");
  const resolvedStoreName =
    storeName?.trim() || (locale === "zh" ? "当前店铺" : "Current store");
  const warnings =
    chart.secondarySeriesLabel === undefined
      ? [
          locale === "zh"
            ? "当前 mock 渲染只输出主序列，便于模拟 Dashboard 插入视图。"
            : "This mock renderer currently outputs the primary series only to simulate dashboard insertion.",
        ]
      : [];

  return {
    locale,
    eyebrow:
      locale === "zh" ? "Daytona Sandbox Render" : "Daytona Sandbox Render",
    heroTitle:
      locale === "zh"
        ? `为 ${productTitle} 生成的 GEO 动态面板`
        : `Generated GEO panel for ${productTitle}`,
    heroBody:
      locale === "zh"
        ? "这块嵌入视图由一段 TypeScript raw code 生成，并准备插入 Dashboard。"
        : "This embedded view was produced from a TypeScript raw code artifact and is ready to be inserted into the dashboard.",
    chartTitle: chart.title,
    chartDescription: chart.description,
    insight: chart.insight,
    metricLabel: chart.metricLabel,
    primarySeriesLabel: chart.primarySeriesLabel,
    secondarySeriesLabel: chart.secondarySeriesLabel,
    promptLabel: locale === "zh" ? "用户问题" : "Prompt",
    promptText: query,
    productLabel: locale === "zh" ? "当前商品" : "Product",
    productTitle,
    storeLabel: locale === "zh" ? "店铺" : "Store",
    storeName: resolvedStoreName,
    leadingLabel: lead?.label ?? chart.metricLabel,
    leadingValue: lead
      ? formatChartValue(lead.primaryValue, chart.unit, locale)
      : "0",
    trailingLabel: tail?.label ?? chart.metricLabel,
    trailingValue: tail
      ? formatChartValue(tail.primaryValue, chart.unit, locale)
      : "0",
    averageLabel: locale === "zh" ? "平均值" : "Average",
    averageValue: formatChartValue(average, chart.unit, locale),
    footerText: chart.description,
    rowsTitle: locale === "zh" ? "插入视图数据行" : "Insertable panel rows",
    rows,
    summary:
      locale === "zh"
        ? "Daytona 已返回一个可嵌入 Dashboard 的 GEO 面板节点。"
        : "Daytona returned an embeddable GEO panel node for the dashboard.",
    warnings,
  };
}

function renderPreviewDocument(model: GeoGeneratedPanelPreviewModel) {
  const rowsMarkup = model.rows
    .map((row) => {
      const noteMarkup = row.note
        ? `<p class="row-note">${escapeHtml(row.note)}</p>`
        : "";
      const highlightClass = row.highlighted ? " row-highlighted" : "";

      return `<div class="row${highlightClass}">
        <div class="row-copy">
          <div class="row-label">${escapeHtml(row.label)}</div>
          ${noteMarkup}
        </div>
        <div class="row-metric">
          <span>${escapeHtml(row.value)}</span>
        </div>
        <div class="row-bar-track">
          <div class="row-bar-fill" style="width:${row.widthPercent}%"></div>
        </div>
      </div>`;
    })
    .join("");

  return `<!doctype html>
<html lang="${model.locale === "zh" ? "zh-CN" : "en"}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(model.chartTitle)}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f8fafc;
        --card: rgba(255, 255, 255, 0.92);
        --card-strong: #ffffff;
        --line: rgba(148, 163, 184, 0.26);
        --text: #0f172a;
        --muted: #475569;
        --soft: #64748b;
        --emerald: #10b981;
        --teal: #14b8a6;
        --sky: #0ea5e9;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at top left, rgba(186, 230, 253, 0.52), transparent 34%),
          radial-gradient(circle at top right, rgba(167, 243, 208, 0.48), transparent 28%),
          linear-gradient(180deg, #f8fafc, #ecfeff 48%, #ffffff);
        color: var(--text);
      }
      .shell {
        padding: 24px;
      }
      .eyebrow {
        display: inline-flex;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.78);
        border: 1px solid rgba(14, 165, 233, 0.18);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #0369a1;
      }
      h1 {
        margin: 16px 0 0;
        font-size: 28px;
        line-height: 1.08;
        letter-spacing: -0.04em;
      }
      .hero-body {
        margin: 12px 0 0;
        color: var(--muted);
        font-size: 14px;
        line-height: 1.65;
        max-width: 760px;
      }
      .grid {
        display: grid;
        gap: 16px;
        margin-top: 22px;
      }
      .card {
        border-radius: 24px;
        border: 1px solid var(--line);
        background: var(--card);
        box-shadow: 0 20px 48px -42px rgba(15, 23, 42, 0.38);
        padding: 18px;
        backdrop-filter: blur(12px);
      }
      .hero-card {
        background:
          radial-gradient(circle at top left, rgba(220, 252, 231, 0.96), rgba(255, 255, 255, 0.92) 44%, rgba(240, 249, 255, 0.96));
      }
      .section-label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--soft);
      }
      .chart-title {
        margin: 10px 0 0;
        font-size: 22px;
        line-height: 1.16;
        letter-spacing: -0.03em;
      }
      .chart-copy {
        margin: 10px 0 0;
        color: var(--muted);
        font-size: 14px;
        line-height: 1.65;
      }
      .meta {
        display: grid;
        gap: 12px;
        margin-top: 18px;
      }
      .meta-card {
        border-radius: 20px;
        background: var(--card-strong);
        border: 1px solid rgba(148, 163, 184, 0.18);
        padding: 14px;
      }
      .meta-value {
        margin-top: 6px;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: -0.03em;
      }
      .insight {
        margin-top: 18px;
        border-radius: 20px;
        padding: 14px;
        background: rgba(14, 165, 233, 0.08);
        border: 1px solid rgba(14, 165, 233, 0.14);
        color: #0f172a;
        font-size: 14px;
        line-height: 1.7;
      }
      .rows-title {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      .rows-stack {
        margin-top: 14px;
        display: grid;
        gap: 12px;
      }
      .row {
        border-radius: 18px;
        padding: 14px;
        border: 1px solid rgba(148, 163, 184, 0.18);
        background: rgba(255, 255, 255, 0.84);
      }
      .row-highlighted {
        border-color: rgba(16, 185, 129, 0.28);
        background: rgba(236, 253, 245, 0.92);
      }
      .row-copy {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
      }
      .row-label {
        font-size: 14px;
        font-weight: 600;
      }
      .row-note {
        margin: 6px 0 0;
        color: var(--soft);
        font-size: 12px;
        line-height: 1.55;
      }
      .row-metric {
        font-size: 12px;
        font-weight: 700;
        color: #047857;
      }
      .row-bar-track {
        margin-top: 12px;
        height: 8px;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(226, 232, 240, 0.96);
      }
      .row-bar-fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--sky), var(--teal), var(--emerald));
      }
      .footer {
        margin-top: 16px;
        color: var(--soft);
        font-size: 12px;
        line-height: 1.65;
      }
      @media (min-width: 920px) {
        .grid {
          grid-template-columns: minmax(0, 0.96fr) minmax(0, 1.04fr);
        }
        .meta {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <div class="eyebrow">${escapeHtml(model.eyebrow)}</div>
      <h1>${escapeHtml(model.heroTitle)}</h1>
      <p class="hero-body">${escapeHtml(model.heroBody)}</p>
      <div class="grid">
        <section class="card hero-card">
          <div class="section-label">${escapeHtml(model.promptLabel)}</div>
          <div class="chart-title">${escapeHtml(model.chartTitle)}</div>
          <p class="chart-copy">${escapeHtml(model.promptText)}</p>
          <div class="meta">
            <div class="meta-card">
              <div class="section-label">${escapeHtml(model.productLabel)}</div>
              <div class="meta-value">${escapeHtml(model.productTitle)}</div>
            </div>
            <div class="meta-card">
              <div class="section-label">${escapeHtml(model.storeLabel)}</div>
              <div class="meta-value">${escapeHtml(model.storeName)}</div>
            </div>
            <div class="meta-card">
              <div class="section-label">${escapeHtml(model.metricLabel)}</div>
              <div class="meta-value">${escapeHtml(model.primarySeriesLabel)}</div>
            </div>
          </div>
          <div class="insight">${escapeHtml(model.insight)}</div>
          <div class="footer">${escapeHtml(model.footerText)}</div>
        </section>
        <section class="card">
          <p class="rows-title">${escapeHtml(model.rowsTitle)}</p>
          <div class="meta">
            <div class="meta-card">
              <div class="section-label">${escapeHtml(model.leadingLabel)}</div>
              <div class="meta-value">${escapeHtml(model.leadingValue)}</div>
            </div>
            <div class="meta-card">
              <div class="section-label">${escapeHtml(model.trailingLabel)}</div>
              <div class="meta-value">${escapeHtml(model.trailingValue)}</div>
            </div>
            <div class="meta-card">
              <div class="section-label">${escapeHtml(model.averageLabel)}</div>
              <div class="meta-value">${escapeHtml(model.averageValue)}</div>
            </div>
          </div>
          <div class="rows-stack">${rowsMarkup}</div>
        </section>
      </div>
    </main>
  </body>
</html>`;
}

function buildRawCode(model: GeoGeneratedPanelPreviewModel, htmlDocument: string) {
  return `const RESULT_MARKER = ${JSON.stringify(RESULT_MARKER)};
const model = ${JSON.stringify(model, null, 2)};
const htmlDocument = ${JSON.stringify(htmlDocument)};

if (!model.chartTitle || !model.rows.length) {
  throw new Error("Geo panel renderer received incomplete chart data.");
}

const highlightedRows = model.rows.filter((row) => row.highlighted).length;
const warnings = [...(model.warnings ?? [])];

if (highlightedRows === 0) {
  warnings.push(
    model.locale === "zh"
      ? "没有高亮行，已按默认顺序返回插入视图。"
      : "No highlighted row was supplied, so the insertable view used the default ordering."
  );
}

const result = {
  title: model.chartTitle,
  summary: model.summary,
  html: htmlDocument,
  warnings,
  renderedAt: new Date().toISOString(),
};

console.log(RESULT_MARKER + JSON.stringify(result));`;
}

function parseRenderResult(stdout: string) {
  const markerIndex = stdout.lastIndexOf(RESULT_MARKER);

  if (markerIndex === -1) {
    throw new Error("Daytona output marker was not found in sandbox stdout.");
  }

  const json = stdout.slice(markerIndex + RESULT_MARKER.length).trim();
  return sandboxRenderResultSchema.parse(JSON.parse(json));
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unknown Daytona execution error.";
}

function buildLocalArtifact(
  model: GeoGeneratedPanelPreviewModel,
  rawCode: string,
  htmlDocument: string
): GeoGeneratedExecutionArtifact {
  return {
    provider: "local-fallback",
    status: "fallback",
    runtime: "typescript",
    title: model.chartTitle,
    summary:
      model.locale === "zh"
        ? "Daytona 尚未配置，当前使用本地 mock 渲染来模拟可插入视图。"
        : "Daytona is not configured yet, so a local mock renderer is simulating the insertable view.",
    entryFile: DEFAULT_ENTRY_FILE,
    rawCode,
    html: htmlDocument,
    executedAt: new Date().toISOString(),
    warnings: model.warnings,
  };
}

export async function buildGeoGeneratedPanelToolPayload({
  chart,
  locale,
  query,
  selectedProduct,
  storeName,
}: ExecuteGeoGeneratedPanelParams): Promise<GeoGeneratedPanelToolPayload> {
  const model = buildPreviewModel({
    chart,
    locale,
    query,
    selectedProduct,
    storeName,
  });
  const htmlDocument = renderPreviewDocument(model);
  const rawCode = buildRawCode(model, htmlDocument);

  if (!isDaytonaConfigured()) {
    return {
      chart,
      execution: buildLocalArtifact(model, rawCode, htmlDocument),
    };
  }

  let sandboxId: string | undefined;
  let sandbox:
    | Awaited<ReturnType<Daytona["create"]>>
    | undefined;

  try {
    const daytona = new Daytona({
      apiKey: process.env.DAYTONA_API_KEY?.trim(),
      apiUrl: process.env.DAYTONA_API_URL?.trim() || undefined,
      target: process.env.DAYTONA_TARGET?.trim() || undefined,
    });

    sandbox = await daytona.create(
      {
        name: `agentshelf-geo-${Date.now()}`,
        language: "typescript",
        ephemeral: true,
        autoStopInterval: 5,
        autoDeleteInterval: 0,
        labels: {
          app: "agentshelf",
          feature: "geo-generated-panel",
        },
      },
      { timeout: 90 }
    );
    sandboxId = sandbox.id;

    const executionResponse = await sandbox.process.codeRun(rawCode, undefined, 45);

    if (executionResponse.exitCode !== 0) {
      throw new Error(
        executionResponse.result?.trim() ||
          "Daytona returned a non-zero exit code while rendering the panel."
      );
    }

    const parsed = parseRenderResult(executionResponse.result ?? "");

    return {
      chart,
      execution: {
        provider: "daytona",
        status: "ready",
        runtime: "typescript",
        title: parsed.title,
        summary: parsed.summary,
        entryFile: DEFAULT_ENTRY_FILE,
        rawCode,
        html: parsed.html,
        executedAt: parsed.renderedAt,
        sandboxId,
        stdout: executionResponse.result,
        warnings: parsed.warnings,
      },
    };
  } catch (error) {
    return {
      chart,
      execution: {
        provider: "daytona",
        status: "error",
        runtime: "typescript",
        title: model.chartTitle,
        summary:
          locale === "zh"
            ? "Daytona 执行失败，当前改用本地渲染结果继续完成 Dashboard 插入演示。"
            : "Daytona execution failed, so the dashboard is continuing with a local fallback render for the insertion demo.",
        entryFile: DEFAULT_ENTRY_FILE,
        rawCode,
        html: htmlDocument,
        executedAt: new Date().toISOString(),
        sandboxId,
        error: getErrorMessage(error),
        warnings: model.warnings,
      },
    };
  } finally {
    if (sandbox) {
      await sandbox.delete().catch(() => undefined);
    }
  }
}
