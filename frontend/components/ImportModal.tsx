"use client";

import { useState, useEffect } from "react";
import {
  X,
  Link,
  Download,
  RefreshCw,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";
import {
  CommerceChannelBadge,
  commerceChannelBrandStyles,
  type CommerceChannelId,
} from "@/components/CommerceChannelIcon";

type Platform = CommerceChannelId;

interface PlatformConfig {
  id: Platform;
  nameKey: TranslationKey;
  descKey: TranslationKey;
}

const platforms: PlatformConfig[] = [
  {
    id: "shopify",
    nameKey: "onboarding.shopify",
    descKey: "onboarding.shopifyDesc",
  },
  {
    id: "stripe",
    nameKey: "onboarding.stripe",
    descKey: "onboarding.stripeDesc",
  },
  {
    id: "tiktok",
    nameKey: "onboarding.tiktok",
    descKey: "onboarding.tiktokDesc",
  },
  {
    id: "amazon",
    nameKey: "onboarding.amazon",
    descKey: "onboarding.amazonDesc",
  },
];

const importSteps: { icon: React.ReactNode; labelKey: TranslationKey; duration: number }[] = [
  { icon: <Link className="w-4 h-4" />, labelKey: "import.connecting", duration: 800 },
  { icon: <Download className="w-4 h-4" />, labelKey: "import.fetching", duration: 1000 },
  { icon: <RefreshCw className="w-4 h-4" />, labelKey: "import.syncing", duration: 800 },
  { icon: <Sparkles className="w-4 h-4" />, labelKey: "import.optimizing", duration: 800 },
];

interface ImportModalProps {
  onClose: () => void;
}

export default function ImportModal({ onClose }: ImportModalProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<"select" | "importing" | "complete">("select");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConfig | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

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
        setTimeout(() => {
          setStepProgress(0);
          setCurrentStep((s) => s + 1);
        }, 200);
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
                    className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                      commerceChannelBrandStyles[platform.id].cardBgClass
                    } ${
                      commerceChannelBrandStyles[platform.id].cardBorderClass
                    } ${
                      commerceChannelBrandStyles[platform.id].cardHoverClass
                    }`}
                  >
                    <div
                      className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl border bg-white shadow-sm dark:bg-zinc-900 ${
                        commerceChannelBrandStyles[platform.id].cardBorderClass
                      }`}
                    >
                      <CommerceChannelBadge
                        channelId={platform.id}
                        className="h-8 w-8"
                        iconClassName="h-[18px] w-[18px]"
                      />
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
                <div
                  className={`absolute inset-0 rounded-xl ${
                    commerceChannelBrandStyles[selectedPlatform.id].accentClass
                  } opacity-20 import-pulse`}
                />
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-xl border bg-white dark:bg-zinc-900 ${
                    commerceChannelBrandStyles[selectedPlatform.id]
                      .cardBorderClass
                  }`}
                >
                  <CommerceChannelBadge
                    channelId={selectedPlatform.id}
                    className="h-9 w-9"
                    iconClassName="h-5 w-5"
                  />
                </div>
              </div>

              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
                {t("import.importing")} {t(selectedPlatform.nameKey)}
              </h3>

              {/* Progress bar */}
              <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${
                    commerceChannelBrandStyles[selectedPlatform.id].accentClass
                  }`}
                  style={{
                    width: `${
                      ((currentStep * 100 + stepProgress) /
                        (importSteps.length * 100)) *
                      100
                    }%`,
                  }}
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
                      <span
                        className={
                          isActive
                            ? commerceChannelBrandStyles[selectedPlatform.id]
                                .cardTextClass
                            : isDone
                            ? "text-emerald-500"
                            : "text-zinc-400"
                        }
                      >
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
