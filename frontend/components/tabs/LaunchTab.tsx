"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Code2,
  MessageSquare,
  Send,
  Copy,
  Check,
  Rocket,
  BarChart3,
  Sparkles,
  X,
} from "lucide-react";
import type { Product } from "@/lib/types";
import {
  getComparison,
  getAuditForProduct,
  launchChecklist,
} from "@/lib/mock";
import { useLanguage } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import Badge from "@/components/Badge";

type PublishState = "idle" | "publishing" | "done";
type PublishModalPhase = "preview" | "publishing" | "success" | null;
type PublishChannelId = "shopify" | "tiktok" | "amazon" | "stripe";

interface PublishChannel {
  id: PublishChannelId;
  name: string;
  iconWrapperClass: string;
  borderClass: string;
}

const PUBLISH_CHANNELS: PublishChannel[] = [
  {
    id: "shopify",
    name: "Shopify",
    iconWrapperClass:
      "bg-[#95BF47]/15 text-[#5F8F3F] dark:bg-[#95BF47]/20 dark:text-[#B7DA84]",
    borderClass: "border-[#95BF47]/30 dark:border-[#95BF47]/25",
  },
  {
    id: "tiktok",
    name: "TikTok Shop",
    iconWrapperClass:
      "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950",
    borderClass: "border-zinc-300 dark:border-zinc-700",
  },
  {
    id: "amazon",
    name: "Amazon Shop",
    iconWrapperClass:
      "bg-[#FF9900]/15 text-[#B96800] dark:bg-[#FF9900]/20 dark:text-[#FFC563]",
    borderClass: "border-[#FF9900]/30 dark:border-[#FF9900]/25",
  },
  {
    id: "stripe",
    name: "Stripe",
    iconWrapperClass:
      "bg-[#635BFF]/15 text-[#635BFF] dark:bg-[#635BFF]/20 dark:text-[#A39FFF]",
    borderClass: "border-[#635BFF]/25 dark:border-[#635BFF]/20",
  },
];

export default function LaunchTab({
  product,
  publishState,
  onPublishStateChange,
}: {
  product: Product;
  publishState: PublishState;
  onPublishStateChange: (productId: string, state: PublishState) => void;
}) {
  const comparison = getComparison(product.id, product.category);
  const audit = getAuditForProduct(product.id);
  const [showJsonLd, setShowJsonLd] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [publishModalPhase, setPublishModalPhase] =
    useState<PublishModalPhase>(null);
  const publishTimerRef = useRef<number | null>(null);
  const { t } = useLanguage();

  const schemaFix = audit.recommendedFixes.find((fix) => fix.type === "schema");
  const faqFix = audit.recommendedFixes.find((fix) => fix.type === "faq");
  const titleFix = audit.recommendedFixes.find((fix) => fix.type === "title");
  const descriptionFix = audit.recommendedFixes.find(
    (fix) => fix.type === "description"
  );
  const comparisonFix = audit.recommendedFixes.find(
    (fix) => fix.type === "comparison"
  );

  const previewTitle = titleFix?.suggestedValue ?? product.title;
  const previewDescription =
    descriptionFix?.suggestedValue ?? product.description;
  const faqItems = faqFix ? parseFaq(faqFix.suggestedValue) : [];
  const checklistItems = launchChecklist.map((item) =>
    item.id === "lc-10"
      ? { ...item, status: publishState === "done" ? "done" : "needs-review" }
      : item
  );

  useEffect(
    () => () => {
      if (publishTimerRef.current !== null) {
        window.clearTimeout(publishTimerRef.current);
        publishTimerRef.current = null;
        onPublishStateChange(product.id, "idle");
      }
    },
    [onPublishStateChange, product.id]
  );

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    window.setTimeout(() => setCopiedField(null), 2000);
  };

  const openPublishExperience = () => {
    if (publishState === "publishing") return;
    setPublishModalPhase(publishState === "done" ? "success" : "preview");
  };

  const handleConfirmPublish = () => {
    const productId = product.id;

    if (publishTimerRef.current !== null) {
      window.clearTimeout(publishTimerRef.current);
    }

    onPublishStateChange(productId, "publishing");
    setPublishModalPhase("publishing");
    publishTimerRef.current = window.setTimeout(() => {
      onPublishStateChange(productId, "done");
      setPublishModalPhase("success");
      publishTimerRef.current = null;
    }, 1800);
  };

  const closePublishExperience = () => {
    if (publishModalPhase === "publishing") return;
    setPublishModalPhase(null);
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {t("launch.title")}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {t("launch.subtitle")}{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {product.title}
            </span>{" "}
            {t("launch.subtitleEnd")}
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <CardTitle>{t("launch.seoVsGeo")}</CardTitle>
            </div>
          </CardHeader>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <ComparisonMetric
              label={t("launch.traffic")}
              before={comparison.seoMetrics.estimatedMonthlyTraffic}
              after={comparison.geoMetrics.estimatedMonthlyTraffic}
              improvement={comparison.improvementPercent.traffic}
              format="number"
              beforeLabel={t("launch.before")}
              afterLabel={t("launch.after")}
            />
            <ComparisonMetric
              label={t("launch.conversion")}
              before={comparison.seoMetrics.conversionRate}
              after={comparison.geoMetrics.conversionRate}
              improvement={comparison.improvementPercent.conversion}
              format="percent"
              beforeLabel={t("launch.before")}
              afterLabel={t("launch.after")}
            />
            <ComparisonMetric
              label={t("launch.cac")}
              before={comparison.seoMetrics.cac}
              after={comparison.geoMetrics.cac}
              improvement={-comparison.improvementPercent.cacReduction}
              format="currency"
              invert
              beforeLabel={t("launch.before")}
              afterLabel={t("launch.after")}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <MetricPanel
              dotClass="bg-zinc-400"
              label={t("launch.beforeLabel")}
              coverageLabel={t("launch.channelCoverage")}
              trafficLabel={t("launch.trafficLabel")}
              conversionLabel={t("launch.conversionLabel")}
              coverage={comparison.seoMetrics.channelCoverage}
              traffic={`${comparison.seoMetrics.estimatedMonthlyTraffic.toLocaleString()}/mo`}
              conversion={`${comparison.seoMetrics.conversionRate}%`}
            />
            <MetricPanel
              accent
              dotClass="bg-emerald-500"
              label={t("launch.afterLabel")}
              coverageLabel={t("launch.channelCoverage")}
              trafficLabel={t("launch.trafficLabel")}
              conversionLabel={t("launch.conversionLabel")}
              coverage={comparison.geoMetrics.channelCoverage.join(", ")}
              traffic={`${comparison.geoMetrics.estimatedMonthlyTraffic.toLocaleString()}/mo`}
              conversion={`${comparison.geoMetrics.conversionRate}%`}
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <div
              className="flex cursor-pointer items-center justify-between"
              onClick={() => setShowJsonLd((current) => !current)}
            >
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <CardTitle>{t("launch.jsonLd")}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">{t("launch.generated")}</Badge>
                <Eye className="h-4 w-4 text-zinc-400" />
              </div>
            </div>
            {showJsonLd && schemaFix && (
              <div className="mt-4 animate-fade-in-up">
                <div className="overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/80">
                  <div className="flex items-center justify-between border-b border-zinc-300 px-4 py-2 dark:border-zinc-700">
                    <span className="font-mono text-xs text-zinc-500">
                      product-schema.jsonld
                    </span>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        copyToClipboard(schemaFix.suggestedValue, "schema");
                      }}
                      className="flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                    >
                      {copiedField === "schema" ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">
                            Copied
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="max-h-60 overflow-auto p-4 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                    {JSON.stringify(
                      JSON.parse(schemaFix.suggestedValue),
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            )}
          </Card>

          <Card>
            <div
              className="flex cursor-pointer items-center justify-between"
              onClick={() => setShowFaq((current) => !current)}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <CardTitle>{t("launch.structuredFaq")}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">{t("launch.generated")}</Badge>
                <Eye className="h-4 w-4 text-zinc-400" />
              </div>
            </div>
            {showFaq && faqFix && (
              <div className="mt-4 animate-fade-in-up">
                <div className="space-y-3">
                  {faqItems.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50"
                    >
                      <div className="mb-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                        Q: {item.question}
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">
                        A: {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => copyToClipboard(faqFix.suggestedValue, "faq")}
                  className="mt-3 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                  {copiedField === "faq" ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Copied
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      {t("launch.copyFaq")}
                    </>
                  )}
                </button>
              </div>
            )}
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <CardTitle>{t("launch.launchChecklist")}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">
                {checklistItems.filter((item) => item.status === "done").length}{" "}
                {t("launch.done")}
              </Badge>
              <Badge variant="warning">
                {
                  checklistItems.filter((item) => item.status === "needs-review")
                    .length
                }{" "}
                {t("launch.review")}
              </Badge>
              <Badge variant="danger">
                {checklistItems.filter((item) => item.status === "missing").length}{" "}
                {t("launch.missing")}
              </Badge>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    {t("launch.task")}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    {t("launch.channel")}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    {t("launch.status")}
                  </th>
                </tr>
              </thead>
              <tbody className="stagger-children">
                {checklistItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30"
                  >
                    <td className="px-3 py-2.5 text-zinc-700 dark:text-zinc-300">
                      {item.task}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
                        {item.channel}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <ChecklistStatus status={item.status} t={t} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-500/6 via-blue-500/5 to-amber-500/10 dark:border-emerald-500/20">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-3">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  <Send className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  {t("launch.publishToChannels")}
                </h3>
                <p className="mt-1 max-w-2xl text-xs text-zinc-500">
                  {t("launch.publishToChannelsDesc")}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PUBLISH_CHANNELS.map((channel) => (
                  <div
                    key={channel.id}
                    className={`inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm dark:bg-zinc-950/60 dark:text-zinc-200 ${channel.borderClass}`}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${channel.iconWrapperClass}`}
                    >
                      <BrandIcon brand={channel.id} className="h-4 w-4" />
                    </div>
                    <span>{channel.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={openPublishExperience}
              disabled={publishState === "publishing"}
              className={`flex min-w-[178px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                publishState === "done"
                  ? "border border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400"
                  : publishState === "publishing"
                  ? "cursor-wait border border-blue-300 bg-blue-100 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-400"
                  : "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              }`}
            >
              {publishState === "done" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {t("launch.published")}
                </>
              ) : publishState === "publishing" ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin dark:border-blue-400/30 dark:border-t-blue-400" />
                  {t("launch.publishing")}
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  {t("launch.reviewAndPublish")}
                </>
              )}
            </button>
          </div>
        </Card>
      </div>

      {publishModalPhase && (
        <PublishFlowModal
          phase={publishModalPhase}
          product={product}
          previewTitle={previewTitle}
          previewDescription={previewDescription}
          faqItems={faqItems}
          schemaText={schemaFix?.suggestedValue}
          comparisonText={comparisonFix?.suggestedValue}
          comparison={comparison}
          t={t}
          onClose={closePublishExperience}
          onConfirmPublish={handleConfirmPublish}
        />
      )}
    </>
  );
}

function PublishFlowModal({
  phase,
  product,
  previewTitle,
  previewDescription,
  faqItems,
  schemaText,
  comparisonText,
  comparison,
  t,
  onClose,
  onConfirmPublish,
}: {
  phase: Exclude<PublishModalPhase, null>;
  product: Product;
  previewTitle: string;
  previewDescription: string;
  faqItems: { question: string; answer: string }[];
  schemaText?: string;
  comparisonText?: string;
  comparison: ReturnType<typeof getComparison>;
  t: (key: TranslationKey) => string;
  onClose: () => void;
  onConfirmPublish: () => void;
}) {
  const schemaTags = getSchemaPreviewTags(schemaText);
  const comparisonPreview = comparisonText
    ? comparisonText
        .split("\n")
        .slice(0, 3)
        .map((line) => line.replace(/^- /, "").trim())
        .filter(Boolean)
        .join(" • ")
    : "";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 md:p-6">
      <div
        className="absolute inset-0 bg-zinc-950/55 backdrop-blur-sm"
        onClick={phase === "publishing" ? undefined : onClose}
      />

      <div className="relative flex h-[90vh] w-[90vw] max-w-7xl flex-col overflow-hidden rounded-[28px] border border-zinc-200 bg-white/95 shadow-2xl ring-1 ring-black/5 animate-fade-in-up dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200/80 px-6 py-5 dark:border-zinc-800">
          <div>
            <Badge
              variant={
                phase === "success"
                  ? "success"
                  : phase === "publishing"
                  ? "info"
                  : "default"
              }
              className="mb-3"
            >
              {phase === "success"
                ? t("launch.published")
                : phase === "publishing"
                ? t("launch.publishing")
                : t("launch.review")}
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {phase === "preview"
                ? t("launch.previewTitle")
                : phase === "publishing"
                ? t("launch.publishingTitle")
                : t("launch.successTitle")}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {phase === "preview"
                ? t("launch.previewDesc")
                : phase === "publishing"
                ? t("launch.publishingDesc")
                : t("launch.successDesc")}
            </p>
          </div>

          {phase !== "publishing" && (
            <button
              onClick={onClose}
              className="rounded-xl border border-zinc-200 bg-white/90 p-2 text-zinc-400 transition-colors hover:text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {phase === "preview" && (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.95fr)]">
              <div className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-2">
                  <ProductPreviewCard
                    label={t("launch.currentListing")}
                    variant="current"
                    product={product}
                    title={product.title}
                    description={product.description}
                    t={t}
                  />
                  <ProductPreviewCard
                    label={t("launch.readyListing")}
                    variant="ready"
                    product={product}
                    title={previewTitle}
                    description={previewDescription}
                    t={t}
                  />
                </div>

                <div className="rounded-[24px] border border-zinc-200 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {t("launch.assetsIncluded")}
                    </h3>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <PublishAssetCard
                      icon={
                        <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      }
                      title={t("launch.faqIncluded")}
                      description={
                        faqItems[0]?.question ?? t("launch.structuredFaq")
                      }
                    />
                    <PublishAssetCard
                      icon={
                        <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      }
                      title={t("launch.schemaIncluded")}
                      description={
                        schemaTags.length > 0
                          ? schemaTags.join(" • ")
                          : t("launch.jsonLd")
                      }
                    />
                    {comparisonPreview && (
                      <PublishAssetCard
                        icon={
                          <BarChart3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        }
                        title={t("launch.comparisonIncluded")}
                        description={comparisonPreview}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[24px] border border-zinc-200 bg-white/90 p-5 dark:border-zinc-800 dark:bg-zinc-900/75">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {t("launch.publishChannels")}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-500">
                        {t("launch.channelsReady")}
                      </p>
                    </div>
                    <Badge variant="info">4</Badge>
                  </div>

                  <div className="mt-4 space-y-3">
                    {PUBLISH_CHANNELS.map((channel) => (
                      <PublishChannelRow
                        key={channel.id}
                        channel={channel}
                        mode="ready"
                        t={t}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-zinc-200 bg-white/90 p-5 dark:border-zinc-800 dark:bg-zinc-900/75">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {t("launch.keyDetails")}
                  </h3>
                  <div className="mt-4 space-y-4">
                    <DetailRow
                      label={t("launch.optimizedTitle")}
                      value={previewTitle}
                    />
                    <DetailRow
                      label={t("launch.optimizedDescription")}
                      value={previewDescription}
                    />
                    {product.targetAudience && product.targetAudience.length > 0 && (
                      <DetailRow
                        label={t("launch.audience")}
                        value={product.targetAudience.slice(0, 3).join(", ")}
                      />
                    )}
                    {product.shippingPolicy && (
                      <DetailRow
                        label={t("launch.shippingPolicy")}
                        value={product.shippingPolicy}
                      />
                    )}
                    {product.returnPolicy && (
                      <DetailRow
                        label={t("launch.returnPolicy")}
                        value={product.returnPolicy}
                      />
                    )}
                  </div>
                </div>

                <div className="rounded-[24px] border border-zinc-200 bg-white/90 p-5 dark:border-zinc-800 dark:bg-zinc-900/75">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {t("launch.seoVsGeo")}
                    </h3>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <SuccessStat
                      label={t("launch.traffic")}
                      value={`+${comparison.improvementPercent.traffic}%`}
                    />
                    <SuccessStat
                      label={t("launch.conversion")}
                      value={`+${comparison.improvementPercent.conversion}%`}
                    />
                    <SuccessStat
                      label={t("launch.cac")}
                      value={`-${comparison.improvementPercent.cacReduction}%`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {phase === "publishing" && (
            <div className="mx-auto w-full max-w-5xl space-y-6 pt-2 pb-10">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                <div className="rounded-[28px] border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-50/80 p-6 shadow-sm dark:border-blue-500/20 dark:from-blue-500/10 dark:via-zinc-950 dark:to-sky-500/5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/90 shadow-sm ring-1 ring-blue-100 dark:bg-zinc-900 dark:ring-blue-400/10">
                      <div className="h-8 w-8 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin dark:border-blue-400/20 dark:border-t-blue-400" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-blue-700 dark:text-blue-300">
                        {product.brand}
                      </div>
                      <h3 className="mt-2 line-clamp-3 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                        {previewTitle}
                      </h3>
                      <p className="mt-2 line-clamp-4 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                        {previewDescription}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-full bg-blue-100/80 dark:bg-blue-400/10">
                    <div className="import-progress-bar h-2 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400" />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <PublishingStat
                      title={t("launch.faqIncluded")}
                      value={faqItems.length.toString()}
                    />
                    <PublishingStat
                      title={t("launch.schemaIncluded")}
                      value={
                        schemaTags.length > 0
                          ? schemaTags.join(" • ")
                          : t("launch.jsonLd")
                      }
                    />
                    <PublishingStat
                      title={t("launch.publishChannels")}
                      value="4"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[24px] border border-zinc-200 bg-white/90 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/75">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {t("launch.publishChannels")}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500">
                          {t("launch.channelsReady")}
                        </p>
                      </div>
                      <Badge variant="info">4</Badge>
                    </div>

                    <div className="mt-4 grid gap-3">
                      {PUBLISH_CHANNELS.map((channel) => (
                        <PublishChannelRow
                          key={channel.id}
                          channel={channel}
                          mode="publishing"
                          t={t}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-zinc-200 bg-white/90 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/75">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {t("launch.assetsIncluded")}
                    </h3>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <SyncItem
                        title={t("launch.optimizedTitle")}
                        value={previewTitle}
                      />
                      <SyncItem
                        title={t("launch.faqIncluded")}
                        value={
                          faqItems[0]?.question ?? t("launch.structuredFaq")
                        }
                      />
                      <SyncItem
                        title={t("launch.schemaIncluded")}
                        value={
                          schemaTags.length > 0
                            ? schemaTags.join(" • ")
                            : t("launch.jsonLd")
                        }
                      />
                      {comparisonPreview && (
                        <SyncItem
                          title={t("launch.comparisonIncluded")}
                          value={comparisonPreview}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {phase === "success" && (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
              <div className="rounded-[28px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/60 p-6 dark:border-emerald-500/20 dark:from-emerald-500/10 dark:via-zinc-950 dark:to-emerald-500/5">
                <Badge variant="success">{t("launch.published")}</Badge>
                <div className="mt-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <h3 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                  {t("launch.successTitle")}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {t("launch.successDesc")}
                </p>

                <div className="mt-6 rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
                  <div className="text-xs font-medium uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-400">
                    {product.brand}
                  </div>
                  <div className="mt-2 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                    {previewTitle}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    {previewDescription}
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <SuccessStat
                    label={t("launch.traffic")}
                    value={`+${comparison.improvementPercent.traffic}%`}
                  />
                  <SuccessStat
                    label={t("launch.conversion")}
                    value={`+${comparison.improvementPercent.conversion}%`}
                  />
                  <SuccessStat
                    label={t("launch.cac")}
                    value={`-${comparison.improvementPercent.cacReduction}%`}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[24px] border border-zinc-200 bg-white/90 p-5 dark:border-zinc-800 dark:bg-zinc-900/75">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {t("launch.liveStatus")}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    {t("launch.channelsLive")}
                  </p>
                  <div className="mt-4 space-y-3">
                    {PUBLISH_CHANNELS.map((channel) => (
                      <PublishChannelRow
                        key={channel.id}
                        channel={channel}
                        mode="live"
                        t={t}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-zinc-200 bg-white/90 p-5 dark:border-zinc-800 dark:bg-zinc-900/75">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {t("launch.publishedPackage")}
                  </h3>
                  <div className="mt-4 space-y-3">
                    <PackageRow
                      title={t("launch.optimizedTitle")}
                      value={previewTitle}
                    />
                    <PackageRow
                      title={t("launch.faqIncluded")}
                      value={faqItems.length.toString()}
                    />
                    <PackageRow
                      title={t("launch.schemaIncluded")}
                      value={
                        schemaTags.length > 0
                          ? schemaTags.join(" • ")
                          : t("launch.jsonLd")
                      }
                    />
                    {comparisonPreview && (
                      <PackageRow
                        title={t("launch.comparisonIncluded")}
                        value={comparisonPreview}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {phase === "preview" && (
          <div className="flex flex-col gap-3 border-t border-zinc-200/80 px-6 py-4 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-zinc-500">{t("launch.channelsReady")}</div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                {t("launch.close")}
              </button>
              <button
                onClick={onConfirmPublish}
                className="flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                <Rocket className="h-4 w-4" />
                {t("launch.publishAction")}
              </button>
            </div>
          </div>
        )}

        {phase === "success" && (
          <div className="flex flex-col gap-3 border-t border-zinc-200/80 px-6 py-4 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-zinc-500">{t("launch.channelsLive")}</div>
            <button
              onClick={onClose}
              className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            >
              {t("launch.close")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricPanel({
  label,
  coverageLabel,
  trafficLabel,
  conversionLabel,
  coverage,
  traffic,
  conversion,
  accent = false,
  dotClass,
}: {
  label: string;
  coverageLabel: string;
  trafficLabel: string;
  conversionLabel: string;
  coverage: string;
  traffic: string;
  conversion: string;
  accent?: boolean;
  dotClass: string;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        accent
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/5"
          : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${dotClass}`} />
        <span
          className={`text-xs font-medium uppercase tracking-wider ${
            accent
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-zinc-500"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="space-y-2">
        <MetricRow label={coverageLabel} value={coverage} accent={accent} />
        <MetricRow label={trafficLabel} value={traffic} accent={accent} />
        <MetricRow
          label={conversionLabel}
          value={conversion}
          accent={accent}
        />
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-zinc-500">{label}</span>
      <span
        className={
          accent
            ? "font-medium text-emerald-600 dark:text-emerald-400"
            : "text-zinc-700 dark:text-zinc-400"
        }
      >
        {value}
      </span>
    </div>
  );
}

function ProductPreviewCard({
  label,
  variant,
  product,
  title,
  description,
  t,
}: {
  label: string;
  variant: "current" | "ready";
  product: Product;
  title: string;
  description: string;
  t: (key: TranslationKey) => string;
}) {
  const attributes = Object.entries(product.attributes ?? {}).slice(0, 4);
  const audience = product.targetAudience?.slice(0, 3) ?? [];
  const initials = title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`rounded-[24px] border p-5 ${
        variant === "ready"
          ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/20 dark:bg-emerald-500/5"
          : "border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-900/60"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <Badge variant={variant === "ready" ? "success" : "default"}>
          {label}
        </Badge>
        {variant === "ready" && (
          <Badge variant="success">{t("launch.readyToPublish")}</Badge>
        )}
      </div>

      <div
        className={`mt-4 flex h-44 flex-col justify-between rounded-[22px] p-5 text-white shadow-lg ${
          variant === "ready"
            ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500"
            : "bg-gradient-to-br from-zinc-500 via-zinc-700 to-zinc-900"
        }`}
      >
        <div className="text-5xl font-semibold tracking-[0.18em] text-white/92">
          {initials}
        </div>
        <div className="flex items-center justify-between text-sm text-white/85">
          <span>{product.brand}</span>
          <span>${product.price.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold leading-tight text-zinc-950 dark:text-zinc-50">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          {description}
        </p>

        {attributes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {attributes.map(([key, value]) => (
              <span
                key={key}
                className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
              >
                {value}
              </span>
            ))}
          </div>
        )}

        {audience.length > 0 && (
          <div className="mt-4">
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
              {t("launch.audience")}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {audience.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-zinc-950 px-2.5 py-1 text-xs text-white dark:bg-zinc-100 dark:text-zinc-950"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
          {product.shippingPolicy && (
            <div className="flex items-center justify-between gap-4">
              <span>{t("launch.shippingPolicy")}</span>
              <span className="text-right text-zinc-700 dark:text-zinc-300">
                {product.shippingPolicy}
              </span>
            </div>
          )}
          {product.returnPolicy && (
            <div className="flex items-center justify-between gap-4">
              <span>{t("launch.returnPolicy")}</span>
              <span className="text-right text-zinc-700 dark:text-zinc-300">
                {product.returnPolicy}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PublishAssetCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[20px] border border-zinc-200 bg-white/85 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/70">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
          {icon}
        </div>
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}

function PublishingStat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] border border-white/80 bg-white/80 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
        {title}
      </div>
      <div className="mt-2 text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
        {value}
      </div>
    </div>
  );
}

function SyncItem({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[18px] border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        <div className="h-3.5 w-3.5 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin dark:border-blue-400/20 dark:border-t-blue-400" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </div>
        <div className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          {value}
        </div>
      </div>
    </div>
  );
}

function PublishChannelRow({
  channel,
  mode,
  t,
  large = false,
}: {
  channel: PublishChannel;
  mode: "ready" | "publishing" | "live";
  t: (key: TranslationKey) => string;
  large?: boolean;
}) {
  const statusLabel =
    mode === "ready"
      ? t("launch.ready")
      : mode === "publishing"
      ? t("launch.publishing")
      : t("launch.live");

  if (mode === "publishing" && large) {
    return (
      <div
        className={`rounded-[22px] border bg-white/90 p-5 shadow-sm dark:bg-zinc-950/75 ${channel.borderClass}`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${channel.iconWrapperClass}`}
          >
            <BrandIcon brand={channel.id} className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
              {channel.name}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              <div className="h-3.5 w-3.5 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin dark:border-blue-400/20 dark:border-t-blue-400" />
              {statusLabel}
            </div>
          </div>
        </div>
        <div className="mt-4 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div className="h-1.5 w-2/3 rounded-full bg-gradient-to-r from-blue-600 to-sky-400 import-progress-bar" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[20px] border bg-white/85 p-4 shadow-sm dark:bg-zinc-950/70 ${channel.borderClass}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${channel.iconWrapperClass}`}
          >
            <BrandIcon brand={channel.id} className="h-6 w-6" />
          </div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {channel.name}
          </div>
        </div>

        {mode === "publishing" ? (
          <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
            <div className="h-3.5 w-3.5 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin dark:border-blue-400/20 dark:border-t-blue-400" />
            {statusLabel}
          </div>
        ) : (
          <Badge variant={mode === "live" ? "success" : "info"}>
            {statusLabel}
          </Badge>
        )}
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </div>
      <div className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {value}
      </div>
    </div>
  );
}

function SuccessStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/80 bg-white/85 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        {value}
      </div>
    </div>
  );
}

function PackageRow({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[18px] border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </div>
        <div className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          {value}
        </div>
      </div>
    </div>
  );
}

function BrandIcon({
  brand,
  className,
}: {
  brand: PublishChannelId;
  className?: string;
}) {
  switch (brand) {
    case "shopify":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path
            d="M7 8.25C7 7.56 7.56 7 8.25 7h7.5C16.44 7 17 7.56 17 8.25V9H7v-.75Z"
            fill="#8DBB46"
          />
          <path
            d="M6 9.25h12l1.05 9.04A1.5 1.5 0 0 1 17.56 20H6.44a1.5 1.5 0 0 1-1.49-1.71L6 9.25Z"
            fill="#95BF47"
          />
          <path
            d="M9 9V7a3 3 0 0 1 6 0v2"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fontSize="7.6"
            fontWeight="700"
            fill="white"
            fontFamily="Arial, sans-serif"
          >
            S
          </text>
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path
            d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z"
            fill="currentColor"
          />
        </svg>
      );
    case "amazon":
      return (
        <svg viewBox="0 0 448 512" className={className} fill="none">
          <path
            d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1Zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6Zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12Zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1Z"
            fill="currentColor"
          />
        </svg>
      );
    case "stripe":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect x="2.5" y="4" width="19" height="16" rx="5" fill="#635BFF" />
          <text
            x="12"
            y="15.2"
            textAnchor="middle"
            fontSize="8.4"
            fontWeight="700"
            fill="white"
            fontFamily="Arial, sans-serif"
          >
            S
          </text>
        </svg>
      );
  }
}

function ComparisonMetric({
  label,
  before,
  after,
  improvement,
  format,
  invert = false,
  beforeLabel = "Before",
  afterLabel = "After",
}: {
  label: string;
  before: number;
  after: number;
  improvement: number;
  format: "number" | "percent" | "currency";
  invert?: boolean;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const formatValue = (value: number) => {
    switch (format) {
      case "number":
        return value.toLocaleString();
      case "percent":
        return `${value}%`;
      case "currency":
        return `$${value.toFixed(2)}`;
    }
  };

  const isPositive = invert ? improvement < 0 : improvement > 0;

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
      <div className="mb-3 text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="mb-1 text-xs text-zinc-500">{beforeLabel}</div>
          <div className="text-lg font-semibold text-zinc-500">
            {formatValue(before)}
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-zinc-300" />
        <div className="flex-1">
          <div className="mb-1 text-xs text-zinc-500">{afterLabel}</div>
          <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            {formatValue(after)}
          </div>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
            isPositive
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {Math.abs(improvement)}%
        </div>
      </div>
    </div>
  );
}

function ChecklistStatus({
  status,
  t,
}: {
  status: "done" | "needs-review" | "missing";
  t: (key: TranslationKey) => string;
}) {
  switch (status) {
    case "done":
      return (
        <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {t("launch.done")}
        </span>
      );
    case "needs-review":
      return (
        <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-3.5 w-3.5" />
          {t("launch.needsReview")}
        </span>
      );
    case "missing":
      return (
        <span className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <XCircle className="h-3.5 w-3.5" />
          {t("launch.missing")}
        </span>
      );
  }
}

function parseFaq(text: string): { question: string; answer: string }[] {
  const items: { question: string; answer: string }[] = [];
  const lines = text.split("\n").filter((line) => line.trim());

  let currentQuestion = "";
  let currentAnswer = "";

  for (const line of lines) {
    if (line.startsWith("Q:")) {
      if (currentQuestion) {
        items.push({
          question: currentQuestion,
          answer: currentAnswer.trim(),
        });
      }
      currentQuestion = line.replace("Q:", "").trim();
      currentAnswer = "";
    } else if (line.startsWith("A:")) {
      currentAnswer = line.replace("A:", "").trim();
    } else if (currentAnswer) {
      currentAnswer += ` ${line.trim()}`;
    }
  }

  if (currentQuestion) {
    items.push({ question: currentQuestion, answer: currentAnswer.trim() });
  }

  return items;
}

function getSchemaPreviewTags(schemaText?: string) {
  if (!schemaText) return [];

  try {
    const schema = JSON.parse(schemaText) as {
      "@type"?: string;
      brand?: unknown;
      offers?: unknown;
      name?: unknown;
    };
    const tags: string[] = [];

    if (schema["@type"]) tags.push(schema["@type"]);
    if (schema.brand) tags.push("Brand");
    if (schema.offers) tags.push("Offer");
    if (schema.name) tags.push("Name");

    return tags;
  } catch {
    return [];
  }
}
