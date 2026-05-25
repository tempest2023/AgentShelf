"use client";

import { useEffect, useRef, useState } from "react";
import {
  Store,
  Link,
  Download,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Languages,
  Sun,
  Moon,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { products } from "@/lib/mock";
import type { TranslationKey } from "@/lib/i18n/translations";
import { useWorkspace } from "@/lib/workspace/context";
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

interface ImportStep {
  icon: React.ReactNode;
  labelKey: TranslationKey;
  duration: number;
}

const importSteps: ImportStep[] = [
  { icon: <Link className="w-5 h-5" />, labelKey: "import.connecting", duration: 1500 },
  { icon: <Download className="w-5 h-5" />, labelKey: "import.fetching", duration: 2000 },
  { icon: <RefreshCw className="w-5 h-5" />, labelKey: "import.syncing", duration: 1500 },
  { icon: <Sparkles className="w-5 h-5" />, labelKey: "import.optimizing", duration: 1500 },
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const { seedStoreCatalog } = useWorkspace();
  const [phase, setPhase] = useState<"select" | "importing" | "complete">("select");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConfig | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const importedPlatformRef = useRef<Platform | null>(null);

  const productCount = user
    ? products.filter((p) => p.category === user.category).length
    : 0;

  const handleSelectPlatform = (platform: PlatformConfig) => {
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
        return prev + 2;
      });
    }, step.duration / 50);

    const timer = setTimeout(() => {
      clearInterval(progressInterval);
      setStepProgress(100);

      if (currentStep < importSteps.length - 1) {
        setTimeout(() => {
          setStepProgress(0);
          setCurrentStep((s) => s + 1);
        }, 300);
      } else {
        setTimeout(() => setPhase("complete"), 500);
      }
    }, step.duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [phase, currentStep, selectedPlatform]);

  useEffect(() => {
    if (
      phase === "complete" &&
      selectedPlatform &&
      importedPlatformRef.current !== selectedPlatform.id
    ) {
      seedStoreCatalog(selectedPlatform.id);
      importedPlatformRef.current = selectedPlatform.id;
    }
  }, [phase, seedStoreCatalog, selectedPlatform]);

  useEffect(() => {
    if (phase === "complete") {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-end px-6 py-4 gap-2">
        <button
          onClick={() => setLocale(locale === "en" ? "zh" : "en")}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 text-xs font-medium"
        >
          <Languages className="w-3.5 h-3.5" />
          {locale === "en" ? "中文" : "EN"}
        </button>
        <button
          onClick={() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
        >
          <Sun className="hidden w-4 h-4 dark:block" />
          <Moon className="w-4 h-4 dark:hidden" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        {phase === "select" && (
          <PlatformSelection
            platforms={platforms}
            t={t}
            onSelect={handleSelectPlatform}
            onSkip={onComplete}
          />
        )}

        {phase === "importing" && selectedPlatform && (
          <ImportAnimation
            platform={selectedPlatform}
            steps={importSteps}
            currentStep={currentStep}
            stepProgress={stepProgress}
            t={t}
          />
        )}

        {phase === "complete" && selectedPlatform && (
          <ImportComplete
            platform={selectedPlatform}
            productCount={productCount}
            t={t}
            onContinue={onComplete}
          />
        )}
      </div>
    </div>
  );
}

function PlatformSelection({
  platforms,
  t,
  onSelect,
  onSkip,
}: {
  platforms: PlatformConfig[];
  t: (key: TranslationKey) => string;
  onSelect: (p: PlatformConfig) => void;
  onSkip: () => void;
}) {
  return (
    <div className="w-full max-w-2xl animate-fade-in-up">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <div className="w-11 h-11 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center">
          <Store className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          AgentShelf
        </span>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
          {t("onboarding.title")}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {t("onboarding.subtitle")}
        </p>
      </div>

      {/* Platform cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => onSelect(platform)}
            className={`group relative text-left p-5 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md ${
              commerceChannelBrandStyles[platform.id].cardBgClass
            } ${commerceChannelBrandStyles[platform.id].cardBorderClass} ${
              commerceChannelBrandStyles[platform.id].cardHoverClass
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-white shadow-sm dark:bg-zinc-900 ${
                  commerceChannelBrandStyles[platform.id].cardBorderClass
                }`}
              >
                <CommerceChannelBadge
                  channelId={platform.id}
                  className="h-9 w-9"
                  iconClassName="h-5 w-5"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mb-1">
                  {t(platform.nameKey)}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t(platform.descKey)}
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight
                className={`w-5 h-5 ${
                  commerceChannelBrandStyles[platform.id].cardTextClass
                }`}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Skip */}
      <div className="text-center mt-8">
        <button
          onClick={onSkip}
          className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          {t("onboarding.skip")}
        </button>
      </div>
    </div>
  );
}

function ImportAnimation({
  platform,
  steps,
  currentStep,
  stepProgress,
  t,
}: {
  platform: PlatformConfig;
  steps: ImportStep[];
  currentStep: number;
  stepProgress: number;
  t: (key: TranslationKey) => string;
}) {
  const overallProgress =
    ((currentStep * 100 + stepProgress) / (steps.length * 100)) * 100;
  const brandStyles = commerceChannelBrandStyles[platform.id];

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <div className="text-center mb-8">
        {/* Platform icon with pulse */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div
            className={`absolute inset-0 rounded-2xl ${brandStyles.accentClass} opacity-20 import-pulse`}
          />
          <div
            className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border bg-white dark:bg-zinc-900 ${brandStyles.cardBorderClass}`}
          >
            <CommerceChannelBadge
              channelId={platform.id}
              className="h-12 w-12"
              iconClassName="h-7 w-7"
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
          {t("import.importing")} {t(platform.nameKey)}
        </h2>
        <p className="text-sm text-zinc-500">
          {t((steps[currentStep] || steps[0]).labelKey)}...
        </p>
      </div>

      {/* Overall progress bar */}
      <div className="mb-8">
        <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out ${brandStyles.accentClass}`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-zinc-400">{Math.round(overallProgress)}%</span>
          <span className="text-xs text-zinc-400">
            {currentStep + 1} / {steps.length}
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep;

          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700"
                  : isDone
                  ? "bg-zinc-50 dark:bg-zinc-800/30"
                  : "opacity-40"
              }`}
            >
              <div
                className={`flex-shrink-0 ${
                  isActive
                    ? brandStyles.cardTextClass
                    : isDone
                    ? "text-emerald-500"
                    : "text-zinc-400"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isActive ? (
                  <div className="import-spin">{step.icon}</div>
                ) : (
                  step.icon
                )}
              </div>
              <span className={`text-sm font-medium flex-1 ${isActive ? "text-zinc-800 dark:text-zinc-200" : isDone ? "text-zinc-500" : "text-zinc-400"}`}>
                {t(step.labelKey)}
              </span>
              {isActive && (
                <div className="w-16 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-100 ${brandStyles.accentClass}`}
                    style={{ width: `${stepProgress}%` }}
                  />
                </div>
              )}
              {isDone && (
                <span className="text-xs text-emerald-500 font-medium">Done</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ImportComplete({
  platform,
  productCount,
  t,
  onContinue,
}: {
  platform: PlatformConfig;
  productCount: number;
  t: (key: TranslationKey) => string;
  onContinue: () => void;
}) {
  return (
    <div className="w-full max-w-md text-center animate-fade-in-up">
      {/* Success icon */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 import-pulse" />
        <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        {t("import.complete")}
      </h2>
      <p className="text-sm text-zinc-500 mb-8">
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{productCount}</span>{" "}
        {t("import.productsImported")}
      </p>

      {/* Mock product items sliding in */}
      <div className="space-y-2 mb-8">
        {Array.from({ length: Math.min(4, productCount) }).map((_, i) => (
          <div
            key={i}
            className="import-slide flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg border bg-white dark:bg-zinc-900 ${
                commerceChannelBrandStyles[platform.id].cardBorderClass
              }`}
            >
              <CommerceChannelBadge
                channelId={platform.id}
                className="h-6 w-6"
                iconClassName="h-3.5 w-3.5"
              />
            </div>
            <div className="flex-1 h-3 bg-zinc-200 dark:bg-zinc-700 rounded" />
            <div className="w-16 h-3 bg-zinc-200 dark:bg-zinc-700 rounded" />
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
      >
        {t("import.continue")}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
