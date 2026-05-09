"use client";

import { useState } from "react";
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

export default function LaunchTab({ product }: { product: Product }) {
  const comparison = getComparison(product.id, product.category);
  const audit = getAuditForProduct(product.id);
  const [showJsonLd, setShowJsonLd] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [publishState, setPublishState] = useState<
    "idle" | "publishing" | "done"
  >("idle");
  const { t } = useLanguage();

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePublish = () => {
    setPublishState("publishing");
    setTimeout(() => setPublishState("done"), 2000);
  };

  const schemaFix = audit.recommendedFixes.find((f) => f.type === "schema");
  const faqFix = audit.recommendedFixes.find((f) => f.type === "faq");

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {t("launch.title")}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {t("launch.subtitle")}{" "}
          <span className="text-zinc-700 dark:text-zinc-300 font-medium">{product.title}</span>{" "}
          {t("launch.subtitleEnd")}
        </p>
      </div>

      {/* SEO vs GEO Before/After */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <CardTitle>{t("launch.seoVsGeo")}</CardTitle>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-zinc-400" />
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {t("launch.beforeLabel")}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">{t("launch.channelCoverage")}</span>
                <span className="text-zinc-700 dark:text-zinc-400">
                  {comparison.seoMetrics.channelCoverage}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">{t("launch.trafficLabel")}</span>
                <span className="text-zinc-700 dark:text-zinc-400">
                  {comparison.seoMetrics.estimatedMonthlyTraffic.toLocaleString()}/mo
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">{t("launch.conversionLabel")}</span>
                <span className="text-zinc-700 dark:text-zinc-400">
                  {comparison.seoMetrics.conversionRate}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {t("launch.afterLabel")}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">{t("launch.channelCoverage")}</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {comparison.geoMetrics.channelCoverage.join(", ")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">{t("launch.trafficLabel")}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {comparison.geoMetrics.estimatedMonthlyTraffic.toLocaleString()}/mo
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">{t("launch.conversionLabel")}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {comparison.geoMetrics.conversionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Generated Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* JSON-LD Schema */}
        <Card>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowJsonLd(!showJsonLd)}
          >
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <CardTitle>{t("launch.jsonLd")}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">{t("launch.generated")}</Badge>
              <Eye className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
          {showJsonLd && schemaFix && (
            <div className="mt-4 animate-fade-in-up">
              <div className="relative bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-300 dark:border-zinc-700">
                  <span className="text-xs text-zinc-500 font-mono">
                    product-schema.jsonld
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(schemaFix.suggestedValue, "schema");
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    {copiedField === "schema" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs text-zinc-700 dark:text-zinc-300 font-mono overflow-x-auto max-h-60 overflow-y-auto">
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

        {/* FAQ */}
        <Card>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowFaq(!showFaq)}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <CardTitle>{t("launch.structuredFaq")}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">{t("launch.generated")}</Badge>
              <Eye className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
          {showFaq && faqFix && (
            <div className="mt-4 animate-fade-in-up">
              <div className="space-y-3">
                {parseFaq(faqFix.suggestedValue).map((item, i) => (
                  <div
                    key={i}
                    className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3"
                  >
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1.5">
                      Q: {item.question}
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      A: {item.answer}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  copyToClipboard(faqFix.suggestedValue, "faq")
                }
                className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {copiedField === "faq" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    {t("launch.copyFaq")}
                  </>
                )}
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* Launch Checklist */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <CardTitle>{t("launch.launchChecklist")}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">
              {launchChecklist.filter((i) => i.status === "done").length} {t("launch.done")}
            </Badge>
            <Badge variant="warning">
              {launchChecklist.filter((i) => i.status === "needs-review").length}{" "}
              {t("launch.review")}
            </Badge>
            <Badge variant="danger">
              {launchChecklist.filter((i) => i.status === "missing").length}{" "}
              {t("launch.missing")}
            </Badge>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider py-2 px-3">
                  {t("launch.task")}
                </th>
                <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider py-2 px-3">
                  {t("launch.channel")}
                </th>
                <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider py-2 px-3">
                  {t("launch.status")}
                </th>
              </tr>
            </thead>
            <tbody className="stagger-children">
              {launchChecklist.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="py-2.5 px-3 text-zinc-700 dark:text-zinc-300">{item.task}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                      {item.channel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <ChecklistStatus status={item.status} t={t} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mock Publish */}
      <Card className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-200 dark:border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {t("launch.mockPublish")}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              {t("launch.mockPublishDesc")}
            </p>
          </div>
          <button
            onClick={handlePublish}
            disabled={publishState !== "idle"}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              publishState === "done"
                ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30"
                : publishState === "publishing"
                ? "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30 cursor-wait"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            {publishState === "done" ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                {t("launch.published")}
              </>
            ) : publishState === "publishing" ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-300 dark:border-blue-400/30 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
                {t("launch.publishing")}
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                {t("launch.publishNow")}
              </>
            )}
          </button>
        </div>
      </Card>
    </div>
  );
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
  const formatValue = (val: number) => {
    switch (format) {
      case "number":
        return val.toLocaleString();
      case "percent":
        return `${val}%`;
      case "currency":
        return `$${val.toFixed(2)}`;
    }
  };

  const isPositive = invert ? improvement < 0 : improvement > 0;

  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
      <div className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
        {label}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="text-xs text-zinc-500 mb-1">{beforeLabel}</div>
          <div className="text-lg font-semibold text-zinc-500">
            {formatValue(before)}
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-zinc-300" />
        <div className="flex-1">
          <div className="text-xs text-zinc-500 mb-1">{afterLabel}</div>
          <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            {formatValue(after)}
          </div>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isPositive
              ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
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
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t("launch.done")}
        </span>
      );
    case "needs-review":
      return (
        <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          {t("launch.needsReview")}
        </span>
      );
    case "missing":
      return (
        <span className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <XCircle className="w-3.5 h-3.5" />
          {t("launch.missing")}
        </span>
      );
  }
}

function parseFaq(
  text: string
): { question: string; answer: string }[] {
  const items: { question: string; answer: string }[] = [];
  const lines = text.split("\n").filter((l) => l.trim());

  let currentQ = "";
  let currentA = "";

  for (const line of lines) {
    if (line.startsWith("Q:")) {
      if (currentQ) {
        items.push({ question: currentQ, answer: currentA.trim() });
      }
      currentQ = line.replace("Q:", "").trim();
      currentA = "";
    } else if (line.startsWith("A:")) {
      currentA = line.replace("A:", "").trim();
    } else if (currentA) {
      currentA += " " + line.trim();
    }
  }

  if (currentQ) {
    items.push({ question: currentQ, answer: currentA.trim() });
  }

  return items;
}
