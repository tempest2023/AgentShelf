"use client";

import {
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
import { useLanguage } from "@/lib/i18n/context";
import Card, { CardHeader, CardTitle } from "@/components/Card";
import Badge from "@/components/Badge";
import ScoreRing from "@/components/ScoreRing";
import { useState } from "react";

function ChatGptIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 41 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ChannelsTab({ product }: { product: Product }) {
  const chatgptPack = getChatgptPack(product.id);
  const googleChecklist = getGoogleChecklist(product.id);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { t } = useLanguage();

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {t("channels.title")}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {t("channels.subtitle")}{" "}
          <span className="text-zinc-700 dark:text-zinc-300 font-medium">{product.title}</span>
        </p>
      </div>

      {/* ChatGPT Commercial Readiness */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <ChatGptIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <CardTitle>{t("channels.chatgpt.title")}</CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">
                {t("channels.chatgpt.subtitle")}
              </p>
            </div>
          </div>
          <Badge variant="success">{t("channels.chatgpt.active")}</Badge>
        </CardHeader>

        <div className="space-y-5">
          {/* Primary Intents */}
          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Target className="w-3 h-3" />
              {t("channels.chatgpt.intentMap")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {chatgptPack.primaryIntents.map((intent, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs text-zinc-700 dark:text-zinc-300"
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
              {t("channels.chatgpt.sponsoredMsg")}
            </h4>
            <div className="relative px-4 py-3 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-lg">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pr-8">
                {chatgptPack.sponsoredMessage}
              </p>
              <button
                onClick={() =>
                  copyToClipboard(chatgptPack.sponsoredMessage, "sponsored")
                }
                className="absolute top-3 right-3 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {copiedField === "sponsored" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-zinc-400" />
                )}
              </button>
            </div>
          </div>

          {/* Ad-safe Summary */}
          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              {t("channels.chatgpt.adSafe")}
            </h4>
            <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <p className="text-sm text-zinc-700 dark:text-zinc-300">{chatgptPack.adSafeSummary}</p>
            </div>
          </div>

          {/* Risk Warnings */}
          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              {t("channels.chatgpt.riskWarnings")}
            </h4>
            <div className="space-y-1.5">
              {chatgptPack.riskWarnings.map((warning, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-lg"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500/70 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{warning}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Claims */}
          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              {t("channels.chatgpt.comparisonClaims")}
            </h4>
            <div className="space-y-2">
              {chatgptPack.comparisonClaims.map((claim, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                >
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 w-28 flex-shrink-0">
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
              {t("channels.chatgpt.requiredFixes")}
            </h4>
            <div className="space-y-1.5">
              {chatgptPack.requiredFixes.map((fix, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{fix}</span>
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
              <CardTitle>{t("channels.google.title")}</CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">
                {t("channels.google.subtitle")}
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
              {t("channels.google.checklist")}
            </h4>
            <div className="space-y-1.5">
              {googleChecklist.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800"
                >
                  {item.status === "pass" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : item.status === "warn" ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 flex-1">
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
              {t("channels.google.feedPatch")}
            </h4>
            <div className="relative bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-300 dark:border-zinc-700">
                <span className="text-xs text-zinc-500 font-mono">feed-patch.json</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(googleChecklist.feedPatch, null, 2),
                      "feed"
                    )
                  }
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  {copiedField === "feed" ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
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
              <pre className="p-4 text-xs text-zinc-700 dark:text-zinc-300 font-mono overflow-x-auto">
                {JSON.stringify(googleChecklist.feedPatch, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </Card>

      {/* Coming Soon Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ComingSoonCard
          name={t("channels.perplexity.name")}
          description={t("channels.perplexity.desc")}
          color="blue"
        />
        <ComingSoonCard
          name={t("channels.claude.name")}
          description={t("channels.claude.desc")}
          color="purple"
        />
        <ComingSoonCard
          name={t("channels.gemini.name")}
          description={t("channels.gemini.desc")}
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
  const { t } = useLanguage();
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-500/20",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-500/20",
    amber: "from-amber-500/10 to-amber-600/5 border-amber-200 dark:border-amber-500/20",
  };

  const textColor = {
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    amber: "text-amber-600 dark:text-amber-400",
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
      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
        <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700">
          {t("channels.comingSoon")}
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
