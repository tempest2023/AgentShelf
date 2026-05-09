"use client";

import { useState, useEffect } from "react";
import {
  X,
  ShoppingBag,
  CreditCard,
  Music,
  Package,
  Link,
  Download,
  RefreshCw,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";

type Platform = "shopify" | "stripe" | "tiktok" | "amazon";

interface PlatformConfig {
  id: Platform;
  nameKey: TranslationKey;
  descKey: TranslationKey;
  icon: React.ReactNode;
  color: {
    bg: string;
    border: string;
    hover: string;
    text: string;
    accent: string;
  };
}

const platforms: PlatformConfig[] = [
  {
    id: "shopify",
    nameKey: "onboarding.shopify",
    descKey: "onboarding.shopifyDesc",
    icon: <ShoppingBag className="w-5 h-5" />,
    color: {
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-800",
      hover: "hover:border-emerald-400 dark:hover:border-emerald-600",
      text: "text-emerald-600 dark:text-emerald-400",
      accent: "bg-emerald-500",
    },
  },
  {
    id: "stripe",
    nameKey: "onboarding.stripe",
    descKey: "onboarding.stripeDesc",
    icon: <CreditCard className="w-5 h-5" />,
    color: {
      bg: "bg-violet-50 dark:bg-violet-950/30",
      border: "border-violet-200 dark:border-violet-800",
      hover: "hover:border-violet-400 dark:hover:border-violet-600",
      text: "text-violet-600 dark:text-violet-400",
      accent: "bg-violet-500",
    },
  },
  {
    id: "tiktok",
    nameKey: "onboarding.tiktok",
    descKey: "onboarding.tiktokDesc",
    icon: <Music className="w-5 h-5" />,
    color: {
      bg: "bg-pink-50 dark:bg-pink-950/30",
      border: "border-pink-200 dark:border-pink-800",
      hover: "hover:border-pink-400 dark:hover:border-pink-600",
      text: "text-pink-600 dark:text-pink-400",
      accent: "bg-pink-500",
    },
  },
  {
    id: "amazon",
    nameKey: "onboarding.amazon",
    descKey: "onboarding.amazonDesc",
    icon: <Package className="w-5 h-5" />,
    color: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
      hover: "hover:border-amber-400 dark:hover:border-amber-600",
      text: "text-amber-600 dark:text-amber-400",
      accent: "bg-amber-500",
    },
  },
];

const importSteps: { icon: React.ReactNode; labelKey: TranslationKey; duration: number }[] = [
  { icon: <Link className="w-4 h-4" />, labelKey: "import.connecting", duration: 800 },
  { icon: <Download className="w-4 h-4" />, labelKey: "import.fetching", duration: 1000 },
  { icon: <RefreshCw className="w-4 h-4" />, labelKey: "import.syncing", duration: 800 },
  { icon: <Sparkles className="w-4 h-4" />, labelKey: "import.optimizing", duration: 800 },
];

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<"select" | "importing" | "complete">("select");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConfig | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setPhase("select");
      setSelectedPlatform(null);
      setCurrentStep(0);
      setStepProgress(0);
    }
  }, [isOpen]);

  const handleSelect = (platform: PlatformConfig) => {
    setSelectedPlatform(platform);
    setPhase("importing");
    setCurrentStep(0);
    setStepProgress(0);
  };

  useEffect(() => {
    if (phase !== "importing" || !selectedPlatform) return;

    const step = importSteps[currentStep];
    if (!step) return;

    setStepProgress(0);

    const progressInterval = setInterval(() => {
      setStepProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 3;
      });
    }, step.duration / 33);

    const timer = setTimeout(() => {
      clearInterval(progressInterval);
      setStepProgress(100);

      if (currentStep < importSteps.length - 1) {
        setTimeout(() => setCurrentStep((s) => s + 1), 200);
      } else {
        setTimeout(() => setPhase("complete"), 300);
      }
    }, step.duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [phase, currentStep, selectedPlatform]);

  useEffect(() => {
    if (phase === "complete") {
      const timer = setTimeout(onClose, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={phase === "select" ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-fade-in-up">
        {/* Close button */}
        {phase === "select" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="p-6">
          {phase === "select" && (
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                {t("importModal.title")}
              </h2>
              <p className="text-sm text-zinc-500 mb-6">
                {t("importModal.subtitle")}
              </p>

              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handleSelect(platform)}
                    className={`text-left p-4 rounded-xl border transition-all duration-200 ${platform.color.bg} ${platform.color.border} ${platform.color.hover}`}
                  >
                    <div className={`mb-2 ${platform.color.text}`}>
                      {platform.icon}
                    </div>
                    <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {t(platform.nameKey)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === "importing" && selectedPlatform && (
            <div className="text-center py-4">
              <div className="relative inline-flex items-center justify-center mb-4">
                <div className={`absolute inset-0 rounded-xl ${selectedPlatform.color.accent} opacity-20 import-pulse`} />
                <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center ${selectedPlatform.color.text} bg-white dark:bg-zinc-800 border ${selectedPlatform.color.border}`}>
                  {selectedPlatform.icon}
                </div>
              </div>

              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                {t("import.importing")} {selectedPlatform.id === "shopify" ? "Shopify" : selectedPlatform.id === "stripe" ? "Stripe" : selectedPlatform.id === "tiktok" ? "TikTok Shop" : "Amazon"}
              </h3>

              {/* Progress bar */}
              <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${selectedPlatform.color.accent}`}
                  style={{ width: `${((currentStep * 100 + stepProgress) / (importSteps.length * 100)) * 100}%` }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {importSteps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isDone = index < currentStep;

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                        isActive ? "bg-zinc-100 dark:bg-zinc-800" : isDone ? "opacity-60" : "opacity-30"
                      }`}
                    >
                      <span className={isActive ? selectedPlatform.color.text : isDone ? "text-emerald-500" : "text-zinc-400"}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
                      </span>
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex-1">
                        {t(step.labelKey)}
                      </span>
                      {isDone && <span className="text-[10px] text-emerald-500">Done</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="text-center py-4 animate-fade-in-up">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {t("import.complete")}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
