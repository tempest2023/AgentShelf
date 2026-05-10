"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Target,
  FileText,
  Code2,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import type { Product, ProductAudit, QuerySimulation, GeoFix } from "@/lib/types";
import { getAuditForProduct, simulateQuery } from "@/lib/mock";
import { useLanguage } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import ScoreRing from "@/components/ScoreRing";
import Badge from "@/components/Badge";
import GeoAgentPanel from "@/components/geo/GeoAgentPanel";
import type { Category } from "@/lib/types";

const suggestedQueries: Record<Category, string[]> = {
  electronics: [
    "best noise cancelling headphones for commuting",
    "best laptop for software development under $2000",
    "wireless earbuds with long battery life",
    "4k monitor for photo editing",
  ],
  outdoor: [
    "waterproof hiking backpack for day trips",
    "lightweight tent for solo camping",
    "best running shoes for trails",
    "waterproof jacket for hiking",
  ],
  pets: [
    "best dog leash for large dogs that pull",
    "interactive cat toys for indoor cats",
    "orthopedic dog bed for large breeds",
    "automatic pet feeder with timer",
  ],
  health: [
    "omega 3 fish oil supplement benefits",
    "best probiotic for gut health",
    "vitamin d3 supplement for immune support",
    "collagen peptides for skin and joints",
  ],
};

export default function GEOTab({ product }: { product: Product }) {
  const [query, setQuery] = useState("");
  const [simulation, setSimulation] = useState<QuerySimulation | null>(null);
  const [expandedFix, setExpandedFix] = useState<number | null>(null);
  const [audit, setAudit] = useState<ProductAudit>(() => getAuditForProduct(product.id));
  const [auditLoading, setAuditLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const { t } = useLanguage();

  const fetchAudit = useCallback(async (p: Product) => {
    setAuditLoading(true);
    try {
      const res = await fetch("/api/geo/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: p }),
      });
      if (res.ok) {
        const data = await res.json();
        setAudit(data);
      }
    } catch {
      // fallback already set
    } finally {
      setAuditLoading(false);
    }
  }, []);

  useEffect(() => {
    setAudit(getAuditForProduct(product.id));
    fetchAudit(product);
  }, [product.id, fetchAudit]);

  const handleSimulate = async (q?: string) => {
    const queryText = q ?? query;
    if (!queryText.trim()) return;
    setQuery(queryText);
    setSimulating(true);
    try {
      const res = await fetch("/api/geo/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText, product }),
      });
      if (res.ok) {
        const data = await res.json();
        setSimulation(data);
        setSimulating(false);
        return;
      }
    } catch {
      // fall through to mock
    }
    setSimulation(simulateQuery(queryText, product.category));
    setSimulating(false);
  };

  const suggestions = suggestedQueries[product.category] ?? suggestedQueries.electronics;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {t("geo.title")}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {t("geo.subtitle")}{" "}
          <span className="text-zinc-700 dark:text-zinc-300 font-medium">{product.title}</span>
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
        <div className="min-w-0 space-y-6">
          {/* Score overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="md:col-span-1 flex flex-col items-center justify-center py-6 relative">
              {auditLoading && (
                <div className="absolute top-2 right-2">
                  <span className="w-3 h-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin inline-block" />
                </div>
              )}
              <ScoreRing score={audit.aiReadinessScore} size={140} strokeWidth={10} />
              <span className="text-xs text-zinc-500 mt-3 font-medium uppercase tracking-wider">
                {t("geo.aiReadiness")}
              </span>
            </Card>
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>{t("geo.scoreBreakdown")}</CardTitle>
              </CardHeader>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <MiniScore
                  label={t("geo.discoverability")}
                  score={audit.discoverabilityScore}
                  icon={<Target className="w-4 h-4" />}
                />
                <MiniScore
                  label={t("geo.clarity")}
                  score={audit.clarityScore}
                  icon={<FileText className="w-4 h-4" />}
                />
                <MiniScore
                  label={t("geo.schema")}
                  score={audit.schemaScore}
                  icon={<Code2 className="w-4 h-4" />}
                />
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{t("geo.product")}:</span>
                  {product.title}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                  <span>
                    {t("geo.brand")}: <span className="text-zinc-700 dark:text-zinc-400">{product.brand}</span>
                  </span>
                  <span>
                    {t("geo.price")}:{" "}
                    <span className="text-zinc-700 dark:text-zinc-400">${product.price}</span>
                  </span>
                  {product.reviews && (
                    <span>
                      {t("geo.rating")}:{" "}
                      <span className="text-zinc-700 dark:text-zinc-400">
                        {product.reviews.rating}/5 ({product.reviews.count.toLocaleString()}{" "}
                        {t("geo.reviews")})
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Missing signals */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <CardTitle>{t("geo.missingSignals")}</CardTitle>
              </div>
              <Badge variant="warning">
                {audit.missingSignals.length} {t("geo.issues")}
              </Badge>
            </CardHeader>
            <div className="space-y-2 stagger-children">
              {audit.missingSignals.map((signal, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500/70 dark:text-amber-400/70 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{signal}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Query Simulator */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <CardTitle>{t("geo.querySimulator")}</CardTitle>
              </div>
            </CardHeader>
            <p className="text-sm text-zinc-500 mb-4">
              {t("geo.querySimulatorDesc")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSimulate()}
                  placeholder={t(`geo.queryPlaceholder.${product.category}` as TranslationKey)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                />
              </div>
              <button
                onClick={() => handleSimulate()}
                disabled={simulating}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-60 disabled:cursor-wait sm:self-auto"
              >
                {simulating ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {simulating ? t("geo.loading") : t("geo.simulate")}
              </button>
            </div>

            {/* Suggested queries */}
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSimulate(s)}
                  className="px-3 py-1.5 text-xs rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            {simulation && (
              <div className="mt-5 space-y-4 animate-fade-in-up">
                <div className="px-4 py-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-medium mb-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {t("geo.agentPreview")}
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {simulation.agentPreviewAnswer}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
                    {t("geo.productMatchResults")}
                  </h4>
                  <div className="space-y-2">
                    {simulation.matches.map((match, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800"
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              match.matchScore >= 80
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : match.matchScore >= 60
                                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                            }`}
                          >
                            {match.matchScore}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            Product ID: {match.productId}
                          </div>
                          <div className="text-xs text-zinc-500 mt-0.5">
                            {match.reason}
                          </div>
                        </div>
                        {match.missingSignals.length > 0 && (
                          <div className="flex-shrink-0">
                            <Badge variant="warning">
                              {match.missingSignals.length} {t("geo.gaps")}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* GEO Fixes */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <CardTitle>{t("geo.recommendedFixes")}</CardTitle>
              </div>
              <Badge variant="info">
                {audit.recommendedFixes.length} {t("geo.suggestions")}
              </Badge>
            </CardHeader>
            <div className="space-y-2 stagger-children">
              {audit.recommendedFixes.map((fix, i) => (
                <GeoFixCard
                  key={i}
                  fix={fix}
                  expanded={expandedFix === i}
                  onToggle={() =>
                    setExpandedFix(expandedFix === i ? null : i)
                  }
                  t={t}
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="min-w-0 xl:sticky xl:top-6">
          <GeoAgentPanel key={product.id} selectedProduct={product} />
        </div>
      </div>
    </div>
  );
}

function MiniScore({
  label,
  score,
  icon,
}: {
  label: string;
  score: number;
  icon: React.ReactNode;
}) {
  const color =
    score >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : score >= 60
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";
  const bg =
    score >= 80
      ? "bg-emerald-500"
      : score >= 60
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-zinc-400">{icon}</span>
        <span className="text-xs text-zinc-500 font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${bg} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className={`text-sm font-semibold ${color} w-8 text-right`}>
          {score}
        </span>
      </div>
    </div>
  );
}

function GeoFixCard({
  fix,
  expanded,
  onToggle,
  t,
}: {
  fix: GeoFix;
  expanded: boolean;
  onToggle: () => void;
  t: (key: TranslationKey) => string;
}) {
  const typeIcons: Record<string, React.ReactNode> = {
    title: <FileText className="w-4 h-4" />,
    description: <FileText className="w-4 h-4" />,
    faq: <MessageSquare className="w-4 h-4" />,
    comparison: <ArrowRight className="w-4 h-4" />,
    schema: <Code2 className="w-4 h-4" />,
  };

  const typeLabels: Record<string, string> = {
    title: t("geo.fixType.title"),
    description: t("geo.fixType.description"),
    faq: t("geo.fixType.faq"),
    comparison: t("geo.fixType.comparison"),
    schema: t("geo.fixType.schema"),
  };

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <span className="text-zinc-400">{typeIcons[fix.type]}</span>
        <span className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {typeLabels[fix.type]}
        </span>
        <Badge variant="default">{fix.type}</Badge>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in-up border-t border-zinc-200 dark:border-zinc-800 pt-3">
          {fix.currentValue && (
            <div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                {t("geo.current")}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 rounded px-3 py-2">
                {fix.currentValue}
              </div>
            </div>
          )}
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
              {t("geo.suggested")}
            </div>
            <div className="text-sm text-zinc-800 dark:text-zinc-200 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/10 rounded px-3 py-2 whitespace-pre-line">
              {fix.suggestedValue}
            </div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              {t("geo.reasoning")}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">{fix.reasoning}</div>
          </div>
        </div>
      )}
    </div>
  );
}
