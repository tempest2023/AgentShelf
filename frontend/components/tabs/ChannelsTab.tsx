"use client";

import {
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Sparkles,
  Shield,
  Target,
  Copy,
  Clock,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { getChatgptPack, getGoogleChecklist } from "@/lib/mock";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import Badge from "@/components/Badge";
import ScoreRing from "@/components/ScoreRing";
import { useState } from "react";

export default function ChannelsTab({ product }: { product: Product }) {
  const chatgptPack = getChatgptPack(product.id);
  const googleChecklist = getGoogleChecklist(product.id);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-zinc-100">
          AI Commerce Channels
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Channel readiness for{" "}
          <span className="text-zinc-300 font-medium">{product.title}</span>
        </p>
      </div>

      {/* ChatGPT Commercial Readiness */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <CardTitle>ChatGPT Commercial Readiness</CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">
                OpenAI Ads pilot-ready analysis
              </p>
            </div>
          </div>
          <Badge variant="success">Active</Badge>
        </CardHeader>

        <div className="space-y-5">
          {/* Primary Intents */}
          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Target className="w-3 h-3" />
              Commercial Intent Map
            </h4>
            <div className="flex flex-wrap gap-2">
              {chatgptPack.primaryIntents.map((intent, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300"
                >
                  &ldquo;{intent}&rdquo;
                </div>
              ))}
            </div>
          </div>

          {/* Sponsored Message */}
          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Recommended Sponsored Message
            </h4>
            <div className="relative px-4 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
              <p className="text-sm text-zinc-300 leading-relaxed pr-8">
                {chatgptPack.sponsoredMessage}
              </p>
              <button
                onClick={() =>
                  copyToClipboard(chatgptPack.sponsoredMessage, "sponsored")
                }
                className="absolute top-3 right-3 p-1 rounded hover:bg-zinc-800 transition-colors"
              >
                {copiedField === "sponsored" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-zinc-500" />
                )}
              </button>
            </div>
          </div>

          {/* Ad-safe Summary */}
          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              Ad-safe Product Summary
            </h4>
            <div className="px-4 py-3 bg-zinc-800/50 border border-zinc-800 rounded-lg">
              <p className="text-sm text-zinc-300">{chatgptPack.adSafeSummary}</p>
            </div>
          </div>

          {/* Risk Warnings */}
          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Risk Warnings
            </h4>
            <div className="space-y-1.5">
              {chatgptPack.riskWarnings.map((warning, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 px-3 py-2 bg-amber-500/5 border border-amber-500/10 rounded-lg"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400/70 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-zinc-400">{warning}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Claims */}
          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              Comparison Claims
            </h4>
            <div className="space-y-2">
              {chatgptPack.comparisonClaims.map((claim, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 bg-zinc-800/50 border border-zinc-800 rounded-lg"
                >
                  <span className="text-xs font-medium text-zinc-300 w-28 flex-shrink-0">
                    vs {claim.competitor}
                  </span>
                  <span className="text-xs text-zinc-500">{claim.claim}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Fixes */}
          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              Required Fixes
            </h4>
            <div className="space-y-1.5">
              {chatgptPack.requiredFixes.map((fix, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 border border-zinc-800 rounded-lg"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                  <span className="text-xs text-zinc-400">{fix}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Google AI Mode Readiness */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </div>
            <div>
              <CardTitle>Google AI Mode / Merchant Center</CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">
                Merchant Center readiness check
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ScoreRing score={googleChecklist.score} size={48} strokeWidth={4} />
          </div>
        </CardHeader>

        <div className="space-y-5">
          {/* Checklist Items */}
          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
              Readiness Checklist
            </h4>
            <div className="space-y-1.5">
              {googleChecklist.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-zinc-800/50 border border-zinc-800"
                >
                  {item.status === "pass" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : item.status === "warn" ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  )}
                  <span className="text-sm text-zinc-300 flex-1">
                    {item.label}
                  </span>
                  {item.detail && (
                    <span className="text-xs text-zinc-500 max-w-xs truncate">
                      {item.detail}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Feed Patch */}
          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              Merchant Center Feed Patch
            </h4>
            <div className="relative bg-zinc-800/80 border border-zinc-700 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700">
                <span className="text-xs text-zinc-500 font-mono">feed-patch.json</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(googleChecklist.feedPatch, null, 2),
                      "feed"
                    )
                  }
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 transition-colors"
                >
                  {copiedField === "feed" ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs text-zinc-300 font-mono overflow-x-auto">
                {JSON.stringify(googleChecklist.feedPatch, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </Card>

      {/* Coming Soon Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ComingSoonCard
          name="Perplexity"
          description="Answer engine visibility and GEO readiness preview"
          color="blue"
        />
        <ComingSoonCard
          name="Claude"
          description="Anthropic's AI assistant commerce integration"
          color="purple"
        />
        <ComingSoonCard
          name="Gemini"
          description="Google's multimodal AI commerce channel"
          color="amber"
        />
      </div>
    </div>
  );
}

function ComingSoonCard({
  name,
  description,
  color,
}: {
  name: string;
  description: string;
  color: "blue" | "purple" | "amber";
}) {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-500/20",
    amber: "from-amber-500/10 to-amber-600/5 border-amber-500/20",
  };

  const textColor = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    amber: "text-amber-400",
  };

  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} relative overflow-hidden`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Clock className={`w-4 h-4 ${textColor[color]}`} />
        <span className={`text-sm font-semibold ${textColor[color]}`}>
          {name}
        </span>
      </div>
      <p className="text-xs text-zinc-500 mb-4">{description}</p>
      <div className="flex items-center gap-1.5 text-xs text-zinc-600">
        <span className="px-2 py-0.5 rounded-full bg-zinc-800/50 border border-zinc-700">
          Coming Soon
        </span>
      </div>
      <div
        className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-5"
        style={{
          background: `radial-gradient(circle, ${
            color === "blue"
              ? "#3b82f6"
              : color === "purple"
              ? "#a855f7"
              : "#f59e0b"
          }, transparent)`,
        }}
      />
    </Card>
  );
}
