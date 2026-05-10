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
import type { LaunchChecklistItem, Product } from "@/lib/types";
import {
  getComparison,
  getAuditForProduct,
  launchChecklist,
} from "@/lib/mock";
import { useLanguage, type Locale } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import Badge from "@/components/Badge";
import CommerceChannelIcon, {
  commerceChannelBrandStyles,
  type CommerceChannelId,
} from "@/components/CommerceChannelIcon";

type PublishState = "idle" | "publishing" | "done";
type PublishModalPhase = "preview" | "publishing" | "success" | null;
type PublishChannelId = CommerceChannelId;

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
    iconWrapperClass: commerceChannelBrandStyles.shopify.iconWrapperClass,
    borderClass: commerceChannelBrandStyles.shopify.pillBorderClass,
  },
  {
    id: "tiktok",
    name: "TikTok Shop",
    iconWrapperClass: commerceChannelBrandStyles.tiktok.iconWrapperClass,
    borderClass: commerceChannelBrandStyles.tiktok.pillBorderClass,
  },
  {
    id: "amazon",
    name: "Amazon Shop",
    iconWrapperClass: commerceChannelBrandStyles.amazon.iconWrapperClass,
    borderClass: commerceChannelBrandStyles.amazon.pillBorderClass,
  },
  {
    id: "stripe",
    name: "Stripe",
    iconWrapperClass: commerceChannelBrandStyles.stripe.iconWrapperClass,
    borderClass: commerceChannelBrandStyles.stripe.pillBorderClass,
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
  const [selectedChannelIds, setSelectedChannelIds] = useState<
    PublishChannelId[]
  >(() => PUBLISH_CHANNELS.map((channel) => channel.id));
  const [publishedChannelIds, setPublishedChannelIds] = useState<
    PublishChannelId[]
  >(() => PUBLISH_CHANNELS.map((channel) => channel.id));
  const publishTimerRef = useRef<number | null>(null);
  const { t, locale } = useLanguage();

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
  const selectedChannels = PUBLISH_CHANNELS.filter((channel) =>
    selectedChannelIds.includes(channel.id)
  );
  const publishedChannels = PUBLISH_CHANNELS.filter((channel) =>
    publishedChannelIds.includes(channel.id)
  );
  const checklistItems: LaunchChecklistItem[] = launchChecklist.map((item) =>
    item.id === "lc-10"
      ? { ...item, status: publishState === "done" ? "done" as const : "needs-review" as const }
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

  const toggleChannelSelection = (channelId: PublishChannelId) => {
    setSelectedChannelIds((current) =>
      current.includes(channelId)
        ? current.filter((id) => id !== channelId)
        : [...current, channelId]
    );
  };

  const handleConfirmPublish = () => {
    const productId = product.id;
    const channelIdsToPublish = [...selectedChannelIds];

    if (channelIdsToPublish.length === 0) return;

    if (publishTimerRef.current !== null) {
      window.clearTimeout(publishTimerRef.current);
    }

    setPublishedChannelIds(channelIdsToPublish);
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
                      <CommerceChannelIcon
                        channelId={channel.id}
                        className="h-4 w-4"
                      />
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
          locale={locale}
          selectedChannels={selectedChannels}
          publishedChannels={publishedChannels}
          t={t}
          onToggleChannel={toggleChannelSelection}
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
  locale,
  selectedChannels,
  publishedChannels,
  t,
  onToggleChannel,
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
  locale: Locale;
  selectedChannels: PublishChannel[];
  publishedChannels: PublishChannel[];
  t: (key: TranslationKey) => string;
  onToggleChannel: (channelId: PublishChannelId) => void;
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
  const activeChannels =
    phase === "preview" ? selectedChannels : publishedChannels;
  const activeChannelCount = activeChannels.length;
  const modalDescription =
    phase === "preview"
      ? t("launch.previewDesc")
      : phase === "publishing"
      ? getPublishingDescription(activeChannelCount, locale)
      : getSuccessDescription(activeChannelCount, locale);

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
              {modalDescription}
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
                        {t("launch.selectChannels")}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-500">
                        {t("launch.channelSelectionHint")}
                      </p>
                    </div>
                    <Badge variant="info">{selectedChannels.length}</Badge>
                  </div>

                  <div className="mt-4 space-y-3">
                    {PUBLISH_CHANNELS.map((channel) => (
                      <PublishChannelRow
                        key={channel.id}
                        channel={channel}
                        mode="selectable"
                        selected={selectedChannels.some(
                          (selectedChannel) => selectedChannel.id === channel.id
                        )}
                        t={t}
                        onToggle={onToggleChannel}
                      />
                    ))}
                  </div>

                  {selectedChannels.length === 0 && (
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                      {t("launch.selectAtLeastOneChannel")}
                    </div>
                  )}
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
                      title={t("launch.selectedChannels")}
                      value={publishedChannels.length.toString()}
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
                          {getPublishingSummary(activeChannelCount, locale)}
                        </p>
                      </div>
                      <Badge variant="info">{activeChannelCount}</Badge>
                    </div>

                    <div className="mt-4 grid gap-3">
                      {activeChannels.map((channel) => (
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
                  {getSuccessDescription(activeChannelCount, locale)}
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
                    {getLiveChannelsSummary(activeChannelCount, locale)}
                  </p>
                  <div className="mt-4 space-y-3">
                    {activeChannels.map((channel) => (
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
            <div className="text-sm text-zinc-500">
              {activeChannelCount > 0
                ? getSelectedChannelsSummary(activeChannelCount, locale)
                : t("launch.selectAtLeastOneChannel")}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                {t("launch.close")}
              </button>
              <button
                onClick={onConfirmPublish}
                disabled={activeChannelCount === 0}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  activeChannelCount === 0
                    ? "cursor-not-allowed bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                    : "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                }`}
              >
                <Rocket className="h-4 w-4" />
                {getPublishActionLabel(activeChannelCount, locale)}
              </button>
            </div>
          </div>
        )}

        {phase === "success" && (
          <div className="flex flex-col gap-3 border-t border-zinc-200/80 px-6 py-4 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-zinc-500">
              {getLiveChannelsSummary(activeChannelCount, locale)}
            </div>
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
  selected = true,
  onToggle,
}: {
  channel: PublishChannel;
  mode: "ready" | "publishing" | "live" | "selectable";
  t: (key: TranslationKey) => string;
  large?: boolean;
  selected?: boolean;
  onToggle?: (channelId: PublishChannelId) => void;
}) {
  const statusLabel =
    mode === "ready"
      ? t("launch.ready")
      : mode === "publishing"
      ? t("launch.publishing")
      : mode === "live"
      ? t("launch.live")
      : selected
      ? t("launch.selected")
      : t("launch.notSelected");

  if (mode === "publishing" && large) {
    return (
      <div
        className={`rounded-[22px] border bg-white/90 p-5 shadow-sm dark:bg-zinc-950/75 ${channel.borderClass}`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${channel.iconWrapperClass}`}
          >
            <CommerceChannelIcon channelId={channel.id} className="h-7 w-7" />
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

  if (mode === "selectable") {
    return (
      <button
        type="button"
        onClick={() => onToggle?.(channel.id)}
        className={`w-full rounded-[20px] border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-zinc-950/70 ${
          selected
            ? `${channel.borderClass} bg-white/95 ring-2 ring-blue-100 dark:ring-blue-500/10`
            : "border-zinc-200 bg-zinc-50/70 opacity-80 dark:border-zinc-800 dark:bg-zinc-900/60"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${channel.iconWrapperClass}`}
            >
              <CommerceChannelIcon
                channelId={channel.id}
                className="h-6 w-6"
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {channel.name}
              </div>
              <div className="mt-1 text-xs text-zinc-500">{t("launch.ready")}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium ${
                selected
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              {statusLabel}
            </span>
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                selected
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-zinc-300 bg-white text-transparent dark:border-zinc-700 dark:bg-zinc-900"
              }`}
            >
              <Check className="h-3 w-3" />
            </div>
          </div>
        </div>
      </button>
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
            <CommerceChannelIcon
              channelId={channel.id}
              className="h-6 w-6"
            />
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

function getSelectedChannelsSummary(count: number, locale: Locale) {
  return locale === "zh"
    ? `已选择 ${count} 个渠道`
    : `${count} channel${count === 1 ? "" : "s"} selected`;
}

function getPublishingSummary(count: number, locale: Locale) {
  return locale === "zh"
    ? `正在同步到 ${count} 个已选渠道`
    : `Syncing to ${count} selected channel${count === 1 ? "" : "s"}`;
}

function getPublishingDescription(count: number, locale: Locale) {
  return locale === "zh"
    ? `正在把更新后的商品页、FAQ 和结构化数据同步到 ${count} 个已选渠道。`
    : `Syncing your updated listing, FAQ, and structured data to ${count} selected channel${count === 1 ? "" : "s"}.`;
}

function getLiveChannelsSummary(count: number, locale: Locale) {
  return locale === "zh"
    ? `${count} 个渠道已上线`
    : `${count} channel${count === 1 ? " is" : "s are"} live`;
}

function getSuccessDescription(count: number, locale: Locale) {
  return locale === "zh"
    ? `更新后的商品内容已经同步到所选的 ${count} 个商业渠道，可以继续查看上线结果。`
    : `Your updated product package is now live across ${count} selected commerce channel${count === 1 ? "" : "s"}.`;
}

function getPublishActionLabel(count: number, locale: Locale) {
  return locale === "zh"
    ? `发布到 ${count} 个渠道`
    : `Publish to ${count} channel${count === 1 ? "" : "s"}`;
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
