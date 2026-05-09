"use client";

import { useState } from "react";
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
import type { Product, QuerySimulation, GeoFix } from "@/lib/types";
import { getAuditForProduct, simulateQuery } from "@/lib/mock";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import ScoreRing from "@/components/ScoreRing";
import Badge from "@/components/Badge";

export default function GEOTab({ product }: { product: Product }) {
  const [query, setQuery] = useState("");
  const [simulation, setSimulation] = useState<QuerySimulation | null>(null);
  const [expandedFix, setExpandedFix] = useState<number | null>(null);

  const audit = getAuditForProduct(product.id);

  const handleSimulate = () => {
    if (!query.trim()) return;
    setSimulation(simulateQuery(query));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-zinc-100">
          GEO Readiness Dashboard
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Generative Engine Optimization analysis for{" "}
          <span className="text-zinc-300 font-medium">{product.title}</span>
        </p>
      </div>

      {/* Score overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1 flex flex-col items-center justify-center py-6">
          <ScoreRing score={audit.aiReadinessScore} size={140} strokeWidth={10} />
          <span className="text-xs text-zinc-500 mt-3 font-medium uppercase tracking-wider">
            AI Readiness
          </span>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Score Breakdown</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-3 gap-6">
            <MiniScore
              label="Discoverability"
              score={audit.discoverabilityScore}
              icon={<Target className="w-4 h-4" />}
            />
            <MiniScore
              label="Clarity"
              score={audit.clarityScore}
              icon={<FileText className="w-4 h-4" />}
            />
            <MiniScore
              label="Schema"
              score={audit.schemaScore}
              icon={<Code2 className="w-4 h-4" />}
            />
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="font-medium text-zinc-300">Product:</span>
              {product.title}
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
              <span>
                Brand: <span className="text-zinc-400">{product.brand}</span>
              </span>
              <span>
                Price:{" "}
                <span className="text-zinc-400">${product.price}</span>
              </span>
              {product.reviews && (
                <span>
                  Rating:{" "}
                  <span className="text-zinc-400">
                    {product.reviews.rating}/5 ({product.reviews.count.toLocaleString()}{" "}
                    reviews)
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
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <CardTitle>Missing Signals</CardTitle>
          </div>
          <Badge variant="warning">
            {audit.missingSignals.length} issues
          </Badge>
        </CardHeader>
        <div className="space-y-2 stagger-children">
          {audit.missingSignals.map((signal, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-zinc-800/50 border border-zinc-800"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400/70 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-zinc-300">{signal}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Query Simulator */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-400" />
            <CardTitle>AI Shopping Query Simulator</CardTitle>
          </div>
        </CardHeader>
        <p className="text-sm text-zinc-500 mb-4">
          Simulate how AI shopping engines would respond to a user query and
          whether this product would be recommended.
        </p>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSimulate()}
              placeholder='Try: "best noise cancelling headphones for commuting"'
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
            />
          </div>
          <button
            onClick={handleSimulate}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Simulate
          </button>
        </div>

        {simulation && (
          <div className="mt-5 space-y-4 animate-fade-in-up">
            <div className="px-4 py-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-medium mb-2">
                <MessageSquare className="w-3.5 h-3.5" />
                AI AGENT PREVIEW ANSWER
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {simulation.agentPreviewAnswer}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
                Product Match Results
              </h4>
              <div className="space-y-2">
                {simulation.matches.map((match, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg bg-zinc-800/50 border border-zinc-800"
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          match.matchScore >= 80
                            ? "bg-emerald-500/15 text-emerald-400"
                            : match.matchScore >= 60
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-zinc-700 text-zinc-400"
                        }`}
                      >
                        {match.matchScore}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-zinc-200">
                        Product ID: {match.productId}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {match.reason}
                      </div>
                    </div>
                    {match.missingSignals.length > 0 && (
                      <div className="flex-shrink-0">
                        <Badge variant="warning">
                          {match.missingSignals.length} gaps
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
            <Lightbulb className="w-4 h-4 text-emerald-400" />
            <CardTitle>Recommended GEO Fixes</CardTitle>
          </div>
          <Badge variant="info">
            {audit.recommendedFixes.length} suggestions
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
            />
          ))}
        </div>
      </Card>
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
      ? "text-emerald-400"
      : score >= 60
      ? "text-amber-400"
      : "text-red-400";
  const bg =
    score >= 80
      ? "bg-emerald-500"
      : score >= 60
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-zinc-500">{icon}</span>
        <span className="text-xs text-zinc-500 font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
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
}: {
  fix: GeoFix;
  expanded: boolean;
  onToggle: () => void;
}) {
  const typeIcons: Record<string, React.ReactNode> = {
    title: <FileText className="w-4 h-4" />,
    description: <FileText className="w-4 h-4" />,
    faq: <MessageSquare className="w-4 h-4" />,
    comparison: <ArrowRight className="w-4 h-4" />,
    schema: <Code2 className="w-4 h-4" />,
  };

  const typeLabels: Record<string, string> = {
    title: "Title Optimization",
    description: "Description Enhancement",
    faq: "FAQ Generation",
    comparison: "Comparison Table",
    schema: "JSON-LD Schema",
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-800/30 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors"
      >
        <span className="text-zinc-500">{typeIcons[fix.type]}</span>
        <span className="flex-1 text-sm font-medium text-zinc-200">
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
        <div className="px-4 pb-4 space-y-3 animate-fade-in-up border-t border-zinc-800 pt-3">
          {fix.currentValue && (
            <div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Current
              </div>
              <div className="text-sm text-zinc-400 bg-zinc-800/50 rounded px-3 py-2">
                {fix.currentValue}
              </div>
            </div>
          )}
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Suggested
            </div>
            <div className="text-sm text-zinc-200 bg-emerald-500/5 border border-emerald-500/10 rounded px-3 py-2 whitespace-pre-line">
              {fix.suggestedValue}
            </div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              Reasoning
            </div>
            <div className="text-sm text-zinc-400">{fix.reasoning}</div>
          </div>
        </div>
      )}
    </div>
  );
}
