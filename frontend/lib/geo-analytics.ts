import {
  getAuditForProduct,
  getComparison,
  products,
} from "@/lib/mock";
import type {
  Category,
  Product,
  ProductAudit,
  SeoGeoComparison,
} from "@/lib/types";

export type GeoAgentLocale = "en" | "zh";
export type GeoMetricKey =
  | "readiness"
  | "discoverability"
  | "clarity"
  | "schema"
  | "traffic"
  | "trafficLift"
  | "conversion"
  | "conversionLift"
  | "cac"
  | "missingSignals";

export type GeoChartUnit = "score" | "percent" | "currency" | "visits" | "count";

export interface GeoChartDatum {
  id: string;
  label: string;
  primaryValue: number;
  secondaryValue?: number;
  note?: string;
  highlighted?: boolean;
}

export interface GeoChartPayload extends Record<string, unknown> {
  title: string;
  description: string;
  insight: string;
  metricLabel: string;
  unit: GeoChartUnit;
  primarySeriesLabel: string;
  secondarySeriesLabel?: string;
  higherIsBetter: boolean;
  initialSort: "asc" | "desc";
  data: GeoChartDatum[];
}

export interface GeoAnalyticsResponse {
  message: string;
  chart: GeoChartPayload;
}

export interface GeoAgentRuntimeContext {
  locale: GeoAgentLocale;
  selectedProduct?: Product | null;
  storeName?: string;
  storeCategory?: Category;
}

interface ProductAnalyticsRecord {
  product: Product;
  audit: ProductAudit;
  comparison: SeoGeoComparison;
}

interface MetricConfig {
  key: GeoMetricKey;
  unit: GeoChartUnit;
  higherIsBetter: boolean;
  aliases: string[];
  label: Record<GeoAgentLocale, string>;
  primarySeriesLabel: Record<GeoAgentLocale, string>;
  secondarySeriesLabel?: Record<GeoAgentLocale, string>;
  getPrimaryValue: (record: ProductAnalyticsRecord) => number;
  getSecondaryValue?: (record: ProductAnalyticsRecord) => number;
}

const CATEGORY_ALIASES: Record<Category, string[]> = {
  electronics: [
    "electronics",
    "electronic",
    "tech",
    "电子",
    "电子产品",
    "数码",
    "3c",
  ],
  outdoor: [
    "outdoor",
    "outdoors",
    "hiking",
    "camping",
    "trail",
    "户外",
    "运动",
    "徒步",
    "露营",
  ],
  pets: ["pet", "pets", "dog", "cat", "宠物", "狗", "猫"],
  health: [
    "health",
    "wellness",
    "supplement",
    "supplements",
    "保健",
    "健康",
    "营养",
    "补剂",
  ],
};

const CATEGORY_LABELS: Record<GeoAgentLocale, Record<Category, string>> = {
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

const METRIC_CONFIGS: MetricConfig[] = [
  {
    key: "trafficLift",
    unit: "percent",
    higherIsBetter: true,
    aliases: [
      "traffic lift",
      "traffic uplift",
      "流量提升",
      "流量增幅",
      "增长流量",
    ],
    label: {
      en: "Traffic uplift after GEO",
      zh: "GEO 后流量提升",
    },
    primarySeriesLabel: {
      en: "Traffic uplift",
      zh: "流量提升",
    },
    getPrimaryValue: (record) => record.comparison.improvementPercent.traffic,
  },
  {
    key: "conversionLift",
    unit: "percent",
    higherIsBetter: true,
    aliases: [
      "conversion lift",
      "conversion uplift",
      "转化提升",
      "转化增幅",
    ],
    label: {
      en: "Conversion uplift after GEO",
      zh: "GEO 后转化提升",
    },
    primarySeriesLabel: {
      en: "Conversion uplift",
      zh: "转化提升",
    },
    getPrimaryValue: (record) => record.comparison.improvementPercent.conversion,
  },
  {
    key: "traffic",
    unit: "visits",
    higherIsBetter: true,
    aliases: [
      "traffic",
      "monthly traffic",
      "流量",
      "访问量",
      "月流量",
      "曝光",
    ],
    label: {
      en: "Estimated monthly traffic",
      zh: "预估月流量",
    },
    primarySeriesLabel: {
      en: "GEO traffic",
      zh: "GEO 流量",
    },
    secondarySeriesLabel: {
      en: "SEO traffic",
      zh: "SEO 流量",
    },
    getPrimaryValue: (record) =>
      record.comparison.geoMetrics.estimatedMonthlyTraffic,
    getSecondaryValue: (record) =>
      record.comparison.seoMetrics.estimatedMonthlyTraffic,
  },
  {
    key: "conversion",
    unit: "percent",
    higherIsBetter: true,
    aliases: [
      "conversion",
      "conversion rate",
      "转化",
      "转化率",
      "成交率",
    ],
    label: {
      en: "Conversion rate",
      zh: "转化率",
    },
    primarySeriesLabel: {
      en: "GEO conversion",
      zh: "GEO 转化率",
    },
    secondarySeriesLabel: {
      en: "SEO conversion",
      zh: "SEO 转化率",
    },
    getPrimaryValue: (record) => record.comparison.geoMetrics.conversionRate,
    getSecondaryValue: (record) => record.comparison.seoMetrics.conversionRate,
  },
  {
    key: "cac",
    unit: "currency",
    higherIsBetter: false,
    aliases: [
      "cac",
      "acquisition cost",
      "customer acquisition cost",
      "获客成本",
      "获取成本",
      "成本",
    ],
    label: {
      en: "Customer acquisition cost",
      zh: "获客成本",
    },
    primarySeriesLabel: {
      en: "GEO CAC",
      zh: "GEO CAC",
    },
    secondarySeriesLabel: {
      en: "SEO CAC",
      zh: "SEO CAC",
    },
    getPrimaryValue: (record) => record.comparison.geoMetrics.cac,
    getSecondaryValue: (record) => record.comparison.seoMetrics.cac,
  },
  {
    key: "missingSignals",
    unit: "count",
    higherIsBetter: false,
    aliases: [
      "missing signals",
      "gaps",
      "issues",
      "缺失信号",
      "问题",
      "差距",
      "缺口",
    ],
    label: {
      en: "Missing GEO signals",
      zh: "缺失 GEO 信号",
    },
    primarySeriesLabel: {
      en: "Missing signals",
      zh: "缺失信号",
    },
    getPrimaryValue: (record) => record.audit.missingSignals.length,
  },
  {
    key: "discoverability",
    unit: "score",
    higherIsBetter: true,
    aliases: ["discoverability", "发现", "可发现性"],
    label: {
      en: "Discoverability score",
      zh: "可发现性分数",
    },
    primarySeriesLabel: {
      en: "Discoverability",
      zh: "可发现性",
    },
    getPrimaryValue: (record) => record.audit.discoverabilityScore,
  },
  {
    key: "clarity",
    unit: "score",
    higherIsBetter: true,
    aliases: ["clarity", "清晰度", "表达清晰"],
    label: {
      en: "Clarity score",
      zh: "清晰度分数",
    },
    primarySeriesLabel: {
      en: "Clarity",
      zh: "清晰度",
    },
    getPrimaryValue: (record) => record.audit.clarityScore,
  },
  {
    key: "schema",
    unit: "score",
    higherIsBetter: true,
    aliases: ["schema", "structured data", "json-ld", "结构化", "结构化数据"],
    label: {
      en: "Schema score",
      zh: "结构化数据分数",
    },
    primarySeriesLabel: {
      en: "Schema",
      zh: "结构化数据",
    },
    getPrimaryValue: (record) => record.audit.schemaScore,
  },
  {
    key: "readiness",
    unit: "score",
    higherIsBetter: true,
    aliases: [
      "readiness",
      "geo readiness",
      "ai readiness",
      "overall score",
      "总分",
      "就绪度",
      "表现",
      "指标",
    ],
    label: {
      en: "AI readiness score",
      zh: "AI 就绪度分数",
    },
    primarySeriesLabel: {
      en: "AI readiness",
      zh: "AI 就绪度",
    },
    getPrimaryValue: (record) => record.audit.aiReadinessScore,
  },
];

const PRODUCT_CONTEXT_ALIASES = [
  "this product",
  "selected product",
  "current product",
  "这个商品",
  "当前商品",
  "当前产品",
  "这个产品",
];

const COMPARISON_ALIASES = ["compare", "comparison", "vs", "versus", "比较", "对比"];
const CATEGORY_SCOPE_ALIASES = ["category", "categories", "类目", "品类"];

function getProductRecord(product: Product): ProductAnalyticsRecord {
  return {
    product,
    audit: getAuditForProduct(product.id),
    comparison: getComparison(product.id, product.category),
  };
}

function getAllProductRecords(): ProductAnalyticsRecord[] {
  return products.map(getProductRecord);
}

function normalizeQuery(query: string) {
  return query.trim().toLowerCase();
}

function parseCategories(query: string): Category[] {
  return (Object.entries(CATEGORY_ALIASES) as [Category, string[]][])
    .filter(([, aliases]) => aliases.some((alias) => query.includes(alias)))
    .map(([category]) => category);
}

function parseMetric(query: string): MetricConfig {
  return (
    METRIC_CONFIGS.find((config) =>
      config.aliases.some((alias) => query.includes(alias))
    ) ??
    METRIC_CONFIGS[METRIC_CONFIGS.length - 1]
  );
}

function getCategoryLabel(category: Category, locale: GeoAgentLocale) {
  return CATEGORY_LABELS[locale][category];
}

function formatMetricValue(
  value: number,
  unit: GeoChartUnit,
  locale: GeoAgentLocale
) {
  const numberLocale = locale === "zh" ? "zh-CN" : "en-US";

  switch (unit) {
    case "percent":
      return `${value}%`;
    case "currency":
      return new Intl.NumberFormat(numberLocale, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 1,
      }).format(value);
    case "visits":
      return new Intl.NumberFormat(numberLocale).format(value);
    case "count":
      return `${value}`;
    case "score":
    default:
      return `${value}`;
  }
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
}

function buildCategoryComparison(
  metric: MetricConfig,
  locale: GeoAgentLocale
): GeoAnalyticsResponse {
  const records = getAllProductRecords();
  const categories = (Object.keys(CATEGORY_ALIASES) as Category[]).map(
    (category) => {
      const categoryRecords = records.filter(
        (record) => record.product.category === category
      );
      const primaryValues = categoryRecords.map(metric.getPrimaryValue);
      const secondaryValues = metric.getSecondaryValue
        ? categoryRecords.map(metric.getSecondaryValue)
        : undefined;

      return {
        id: category,
        label: getCategoryLabel(category, locale),
        primaryValue: average(primaryValues),
        secondaryValue: secondaryValues ? average(secondaryValues) : undefined,
      };
    }
  );

  const sorted = [...categories].sort((left, right) =>
    metric.higherIsBetter
      ? right.primaryValue - left.primaryValue
      : left.primaryValue - right.primaryValue
  );
  const leader = sorted[0];
  const trailer = sorted[sorted.length - 1];

  return {
    message:
      locale === "zh"
        ? `我把 4 个类目的${metric.label.zh}放在一起对比了。当前 ${leader?.label} 领先，${trailer?.label} 还有继续优化空间。`
        : `I compared ${metric.label.en.toLowerCase()} across all four categories. ${leader?.label} leads right now, while ${trailer?.label} has the most room to improve.`,
    chart: {
      title:
        locale === "zh"
          ? `类目对比：${metric.label.zh}`
          : `Category comparison: ${metric.label.en}`,
      description:
        locale === "zh"
          ? "按类目平均值汇总"
          : "Averaged by category",
      insight:
        locale === "zh"
          ? `${leader?.label} 当前位居第一，建议优先复用它的 GEO 优化模式。`
          : `${leader?.label} is the strongest category right now, so it is a good benchmark for the rest of the catalog.`,
      metricLabel: metric.label[locale],
      unit: metric.unit,
      primarySeriesLabel: metric.primarySeriesLabel[locale],
      secondarySeriesLabel: metric.secondarySeriesLabel?.[locale],
      higherIsBetter: metric.higherIsBetter,
      initialSort: metric.higherIsBetter ? "desc" : "asc",
      data: categories,
    },
  };
}

function buildCategoryBreakdown(
  category: Category,
  metric: MetricConfig,
  locale: GeoAgentLocale
): GeoAnalyticsResponse {
  const categoryRecords = getAllProductRecords().filter(
    (record) => record.product.category === category
  );
  const categoryLabel = getCategoryLabel(category, locale);

  const data = categoryRecords.map((record) => ({
    id: record.product.id,
    label: record.product.title,
    primaryValue: metric.getPrimaryValue(record),
    secondaryValue: metric.getSecondaryValue?.(record),
    note: record.product.brand,
  }));

  const sorted = [...data].sort((left, right) =>
    metric.higherIsBetter
      ? right.primaryValue - left.primaryValue
      : left.primaryValue - right.primaryValue
  );
  const leader = sorted[0];
  const averageValue = average(data.map((item) => item.primaryValue));

  return {
    message:
      locale === "zh"
        ? `我查看了 ${categoryLabel} 类目下 ${data.length} 个商品的${metric.label.zh}。当前表现最突出的是 ${leader?.label}，类目平均值约为 ${formatMetricValue(averageValue, metric.unit, locale)}。`
        : `I checked ${metric.label.en.toLowerCase()} for ${data.length} products in ${categoryLabel}. ${leader?.label} is leading this group, and the category average is about ${formatMetricValue(averageValue, metric.unit, locale)}.`,
    chart: {
      title:
        locale === "zh"
          ? `${categoryLabel}类目商品表现`
          : `${categoryLabel} product performance`,
      description:
        locale === "zh"
          ? `按商品拆解 ${metric.label.zh}`
          : `Product-level breakdown of ${metric.label.en.toLowerCase()}`,
      insight:
        locale === "zh"
          ? `当前头部商品是 ${leader?.label}，可以把它作为这个类目的 GEO 优化模板。`
          : `${leader?.label} is the current benchmark for this category and can guide the next GEO optimization pass.`,
      metricLabel: metric.label[locale],
      unit: metric.unit,
      primarySeriesLabel: metric.primarySeriesLabel[locale],
      secondarySeriesLabel: metric.secondarySeriesLabel?.[locale],
      higherIsBetter: metric.higherIsBetter,
      initialSort: metric.higherIsBetter ? "desc" : "asc",
      data,
    },
  };
}

function buildSelectedProductView(
  selectedProduct: Product,
  metric: MetricConfig,
  locale: GeoAgentLocale
): GeoAnalyticsResponse {
  const record = getProductRecord(selectedProduct);
  const categoryPeers = getAllProductRecords().filter(
    (peer) => peer.product.category === selectedProduct.category
  );
  const categoryAverage = average(
    categoryPeers.map((peer) => metric.getPrimaryValue(peer))
  );

  if (metric.key === "readiness") {
    const scoreData: GeoChartDatum[] = [
      {
        id: "readiness",
        label: locale === "zh" ? "AI 就绪度" : "AI Readiness",
        primaryValue: record.audit.aiReadinessScore,
      },
      {
        id: "discoverability",
        label: locale === "zh" ? "可发现性" : "Discoverability",
        primaryValue: record.audit.discoverabilityScore,
      },
      {
        id: "clarity",
        label: locale === "zh" ? "清晰度" : "Clarity",
        primaryValue: record.audit.clarityScore,
      },
      {
        id: "schema",
        label: locale === "zh" ? "结构化数据" : "Schema",
        primaryValue: record.audit.schemaScore,
      },
    ];
    const strongest = [...scoreData].sort(
      (left, right) => right.primaryValue - left.primaryValue
    )[0];
    const weakest = [...scoreData].sort(
      (left, right) => left.primaryValue - right.primaryValue
    )[0];

    return {
      message:
        locale === "zh"
          ? `这是当前商品 ${selectedProduct.title} 的 GEO 关键分项。${strongest?.label} 最强，${weakest?.label} 仍是主要短板。`
          : `Here is the GEO breakdown for ${selectedProduct.title}. ${strongest?.label} is strongest, while ${weakest?.label} is still the main gap.`,
      chart: {
        title:
          locale === "zh"
            ? `当前商品 GEO 分项`
            : `Current product GEO breakdown`,
        description: selectedProduct.title,
        insight:
          locale === "zh"
            ? `这件商品当前最需要补的是 ${weakest?.label}，先补齐它通常最能拉动整体表现。`
            : `${weakest?.label} is the clearest leverage point for improving the overall GEO profile of this product.`,
        metricLabel: metric.label[locale],
        unit: "score",
        primarySeriesLabel:
          locale === "zh" ? "当前商品分数" : "Current product score",
        higherIsBetter: true,
        initialSort: "desc",
        data: scoreData,
      },
    };
  }

  const primaryValue = metric.getPrimaryValue(record);

  return {
    message:
      locale === "zh"
        ? `我查看了当前商品 ${selectedProduct.title} 的${metric.label.zh}。它当前是 ${formatMetricValue(primaryValue, metric.unit, locale)}，同类平均值约为 ${formatMetricValue(categoryAverage, metric.unit, locale)}。`
        : `I checked ${metric.label.en.toLowerCase()} for ${selectedProduct.title}. It is currently ${formatMetricValue(primaryValue, metric.unit, locale)}, versus a category average of about ${formatMetricValue(categoryAverage, metric.unit, locale)}.`,
    chart: {
      title:
        locale === "zh"
          ? `当前商品：${metric.label.zh}`
          : `Current product: ${metric.label.en}`,
      description: selectedProduct.title,
      insight:
        locale === "zh"
          ? `图里同时给了当前值和同类基线，便于判断这件商品是头部还是仍需补强。`
          : `The chart shows both the product value and the category baseline so you can quickly see whether this SKU is leading or lagging.`,
      metricLabel: metric.label[locale],
      unit: metric.unit,
      primarySeriesLabel: metric.primarySeriesLabel[locale],
      secondarySeriesLabel: metric.secondarySeriesLabel?.[locale],
      higherIsBetter: metric.higherIsBetter,
      initialSort: metric.higherIsBetter ? "desc" : "asc",
      data: [
        {
          id: selectedProduct.id,
          label: selectedProduct.title,
          primaryValue,
          secondaryValue: metric.getSecondaryValue?.(record),
          note:
            locale === "zh"
              ? `同类平均：${formatMetricValue(categoryAverage, metric.unit, locale)}`
              : `Category avg: ${formatMetricValue(categoryAverage, metric.unit, locale)}`,
          highlighted: true,
        },
      ],
    },
  };
}

function queryTargetsCurrentProduct(query: string) {
  return PRODUCT_CONTEXT_ALIASES.some((alias) => query.includes(alias));
}

function queryRequestsCategoryScope(query: string) {
  return CATEGORY_SCOPE_ALIASES.some((alias) => query.includes(alias));
}

function queryRequestsComparison(query: string) {
  return COMPARISON_ALIASES.some((alias) => query.includes(alias));
}

export function parseGeoAgentRuntimeContext(
  context?: { description: string; value: string }[]
): GeoAgentRuntimeContext {
  const runtimeContext: GeoAgentRuntimeContext = {
    locale: "en",
  };

  if (!context) {
    return runtimeContext;
  }

  for (const item of context) {
    if (item.description === "ui_locale") {
      runtimeContext.locale = item.value === "zh" ? "zh" : "en";
      continue;
    }

    if (item.description === "selected_product") {
      try {
        const parsed = JSON.parse(item.value) as Partial<Product>;
        runtimeContext.selectedProduct =
          products.find((product) => product.id === parsed.id) ?? undefined;
      } catch {
        runtimeContext.selectedProduct = undefined;
      }
      continue;
    }

    if (item.description === "store_context") {
      try {
        const parsed = JSON.parse(item.value) as {
          storeName?: string;
          category?: Category;
        };
        runtimeContext.storeName = parsed.storeName;
        runtimeContext.storeCategory = parsed.category;
      } catch {
        runtimeContext.storeName = undefined;
      }
    }
  }

  return runtimeContext;
}

export function answerGeoAnalyticsQuery(
  rawQuery: string,
  runtimeContext: GeoAgentRuntimeContext
): GeoAnalyticsResponse {
  const query = normalizeQuery(rawQuery);
  const locale = runtimeContext.locale;
  const metric = parseMetric(query);
  const categories = parseCategories(query);
  const shouldCompare = queryRequestsComparison(query) || categories.length > 1;
  const targetCurrentProduct =
    queryTargetsCurrentProduct(query) ||
    (!shouldCompare &&
      categories.length === 0 &&
      !queryRequestsCategoryScope(query) &&
      !!runtimeContext.selectedProduct);

  if (targetCurrentProduct && runtimeContext.selectedProduct) {
    return buildSelectedProductView(
      runtimeContext.selectedProduct,
      metric,
      locale
    );
  }

  if (categories.length === 1) {
    return buildCategoryBreakdown(categories[0], metric, locale);
  }

  if (shouldCompare || queryRequestsCategoryScope(query)) {
    return buildCategoryComparison(metric, locale);
  }

  if (runtimeContext.storeCategory) {
    return buildCategoryBreakdown(runtimeContext.storeCategory, metric, locale);
  }

  return buildCategoryComparison(metric, locale);
}

export function extractLatestUserQuery(
  messages: Array<{ role?: string; content?: unknown }>
) {
  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  if (!lastUserMessage) {
    return "";
  }

  if (typeof lastUserMessage.content === "string") {
    return lastUserMessage.content;
  }

  if (Array.isArray(lastUserMessage.content)) {
    return lastUserMessage.content
      .map((part) =>
        part &&
        typeof part === "object" &&
        "type" in part &&
        part.type === "text" &&
        "text" in part
          ? String(part.text)
          : ""
      )
      .join(" ")
      .trim();
  }

  return "";
}
