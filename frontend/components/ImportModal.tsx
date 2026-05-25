"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Download,
  FileSpreadsheet,
  Link,
  RefreshCw,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { useLanguage } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";
import { parseCatalogCsv } from "@/lib/workspace/csv";
import { useWorkspace } from "@/lib/workspace/context";
import type { WorkspaceImportPreview } from "@/lib/workspace/types";
import {
  CommerceChannelBadge,
  commerceChannelBrandStyles,
  type CommerceChannelId,
} from "@/components/CommerceChannelIcon";

type Platform = Exclude<CommerceChannelId, "google" | "openai">;
type ImportMode = "platform" | "csv" | null;

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
  { icon: <Link className="h-4 w-4" />, labelKey: "import.connecting", duration: 700 },
  { icon: <Download className="h-4 w-4" />, labelKey: "import.fetching", duration: 900 },
  { icon: <RefreshCw className="h-4 w-4" />, labelKey: "import.syncing", duration: 700 },
  { icon: <Sparkles className="h-4 w-4" />, labelKey: "import.optimizing", duration: 700 },
];

interface ImportModalProps {
  onClose: () => void;
}

export default function ImportModal({ onClose }: ImportModalProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { importProducts, seedStoreCatalog } = useWorkspace();
  const [phase, setPhase] = useState<"select" | "preview" | "importing" | "complete">("select");
  const [importMode, setImportMode] = useState<ImportMode>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConfig | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [csvPreview, setCsvPreview] = useState<WorkspaceImportPreview | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importCount, setImportCount] = useState(0);

  const invalidRowCount = useMemo(
    () => csvPreview?.rows.filter((row) => row.errors.length > 0).length ?? 0,
    [csvPreview]
  );
  const warningCount = useMemo(
    () =>
      csvPreview?.rows.reduce((sum, row) => sum + row.warnings.length, 0) ?? 0,
    [csvPreview]
  );

  const resetImportState = () => {
    setCurrentStep(0);
    setStepProgress(0);
    setImportCount(0);
  };

  const handlePlatformSelect = (platform: PlatformConfig) => {
    setSelectedPlatform(platform);
    setImportMode("platform");
    setImportError(null);
    resetImportState();
    setPhase("importing");
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !user) {
      return;
    }

    try {
      const text = await file.text();
      const preview = parseCatalogCsv({
        text,
        fallbackCategory: user.category,
      });

      if (preview.headers.length === 0) {
        setImportError(t("importModal.emptyFile"));
        setCsvPreview(null);
        return;
      }

      setFileName(file.name);
      setImportError(null);
      setCsvPreview(preview);
      setImportMode("csv");
      setPhase("preview");
    } catch {
      setImportError(t("importModal.parseError"));
      setCsvPreview(null);
    }
  };

  const startCsvImport = () => {
    if (!csvPreview || csvPreview.products.length === 0) {
      return;
    }

    setSelectedPlatform(null);
    setImportError(null);
    resetImportState();
    setPhase("importing");
  };

  useEffect(() => {
    if (phase !== "importing") return;

    const step = importSteps[currentStep];
    if (!step) return;

    const progressInterval = window.setInterval(() => {
      setStepProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 3;
      });
    }, step.duration / 33);

    const timer = window.setTimeout(() => {
      window.clearInterval(progressInterval);
      setStepProgress(100);

      if (currentStep < importSteps.length - 1) {
        window.setTimeout(() => {
          setStepProgress(0);
          setCurrentStep((value) => value + 1);
        }, 180);
        return;
      }

      const nextImportCount =
        importMode === "csv" && csvPreview
          ? importProducts(csvPreview.products)
          : selectedPlatform
            ? seedStoreCatalog(selectedPlatform.id)
            : 0;

      setImportCount(nextImportCount);
      window.setTimeout(() => setPhase("complete"), 260);
    }, step.duration);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(progressInterval);
    };
  }, [
    csvPreview,
    currentStep,
    importMode,
    importProducts,
    phase,
    seedStoreCatalog,
    selectedPlatform,
  ]);

  useEffect(() => {
    if (phase === "complete") {
      const timer = window.setTimeout(onClose, 1500);
      return () => window.clearTimeout(timer);
    }
  }, [onClose, phase]);

  const activeStep = importSteps[currentStep] ?? importSteps[0];
  const csvExampleColumns = ["title", "price", "brand", "description", "sku", "gtin", "category"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={phase === "select" || phase === "preview" ? onClose : undefined}
      />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        {(phase === "select" || phase === "preview") && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="overflow-y-auto p-6">
          {phase === "select" && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {t("importModal.title")}
                </h2>
                <p className="text-sm text-zinc-500">
                  {t("importModal.subtitle")}
                </p>
              </div>

              <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/60 p-5 dark:border-blue-500/30 dark:bg-blue-500/5">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-blue-600/10 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {t("importModal.csvTitle")}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {t("importModal.csvDesc")}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {csvExampleColumns.map((column) => (
                        <span
                          key={column}
                          className="rounded-full border border-blue-200 bg-white px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:border-blue-500/20 dark:bg-zinc-900 dark:text-blue-300"
                        >
                          {column}
                        </span>
                      ))}
                    </div>
                    <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500">
                      <Upload className="h-4 w-4" />
                      {t("importModal.uploadCsv")}
                      <input
                        type="file"
                        accept=".csv,text/csv"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    {importError ? (
                      <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-300">
                        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{importError}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {t("importModal.demoTitle")}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    {t("importModal.demoDesc")}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => handlePlatformSelect(platform)}
                      className={`rounded-xl border p-4 text-left transition-all duration-200 ${
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
                      <p className="mt-1 text-xs text-zinc-500">
                        {t(platform.descKey)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {phase === "preview" && csvPreview && (
            <div className="space-y-5">
              <div>
                <h2 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {t("importModal.previewTitle")}
                </h2>
                <p className="text-sm text-zinc-500">
                  {fileName || t("importModal.csvTitle")}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <PreviewStat
                  label={t("importModal.validRows")}
                  value={`${csvPreview.products.length}`}
                  tone="success"
                />
                <PreviewStat
                  label={t("importModal.invalidRows")}
                  value={`${invalidRowCount}`}
                  tone={invalidRowCount > 0 ? "danger" : "default"}
                />
                <PreviewStat
                  label={t("importModal.warnings")}
                  value={`${warningCount}`}
                  tone={warningCount > 0 ? "warning" : "default"}
                />
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
                <div className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {t("importModal.recognizedColumns")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {csvPreview.recognizedColumns.map((column) => (
                    <span
                      key={column}
                      className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-zinc-900 dark:text-emerald-300"
                    >
                      {column}
                    </span>
                  ))}
                  {csvPreview.ignoredColumns.map((column) => (
                    <span
                      key={column}
                      className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
                    >
                      {column}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_90px_110px] gap-3 border-b border-zinc-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
                  <span>{t("importModal.product")}</span>
                  <span>{t("importModal.brand")}</span>
                  <span>{t("importModal.price")}</span>
                  <span>{t("importModal.status")}</span>
                </div>
                <div className="max-h-72 space-y-2 overflow-y-auto px-2 py-2">
                  {csvPreview.rows.slice(0, 8).map((row) => {
                    const hasErrors = row.errors.length > 0;
                    const hasWarnings = row.warnings.length > 0;

                    return (
                      <div
                        key={row.rowNumber}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-3 dark:border-zinc-800 dark:bg-zinc-900"
                      >
                        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_90px_110px] gap-3 text-sm">
                          <div className="min-w-0">
                            <div className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                              {row.title || t("importModal.missingTitle")}
                            </div>
                            <div className="text-xs text-zinc-500">
                              Row {row.rowNumber} · {row.category}
                            </div>
                          </div>
                          <span className="truncate text-zinc-600 dark:text-zinc-400">
                            {row.brand || "—"}
                          </span>
                          <span className="text-zinc-600 dark:text-zinc-400">
                            {row.priceText}
                          </span>
                          <span className="text-xs font-medium">
                            {hasErrors ? (
                              <span className="text-red-600 dark:text-red-400">
                                {t("importModal.invalid")}
                              </span>
                            ) : hasWarnings ? (
                              <span className="text-amber-600 dark:text-amber-400">
                                {t("importModal.review")}
                              </span>
                            ) : (
                              <span className="text-emerald-600 dark:text-emerald-400">
                                {t("importModal.ready")}
                              </span>
                            )}
                          </span>
                        </div>
                        {(hasErrors || hasWarnings) && (
                          <div className="mt-2 space-y-1">
                            {row.errors.map((error) => (
                              <div
                                key={error}
                                className="text-xs text-red-600 dark:text-red-400"
                              >
                                {error}
                              </div>
                            ))}
                            {row.warnings.map((warning) => (
                              <div
                                key={warning}
                                className="text-xs text-amber-600 dark:text-amber-400"
                              >
                                {warning}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setPhase("select")}
                  className="rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                  {t("importModal.back")}
                </button>
                <button
                  onClick={startCsvImport}
                  disabled={csvPreview.products.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {t("importModal.importValidRows")} ({csvPreview.products.length})
                </button>
              </div>
            </div>
          )}

          {phase === "importing" && (
            <div className="py-4 text-center">
              <div className="relative mb-4 inline-flex items-center justify-center">
                {selectedPlatform ? (
                  <>
                    <div
                      className={`absolute inset-0 rounded-xl ${
                        commerceChannelBrandStyles[selectedPlatform.id].accentClass
                      } import-pulse opacity-20`}
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
                  </>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                )}
              </div>

              <h3 className="mb-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {importMode === "csv"
                  ? `${t("import.importing")} CSV`
                  : `${t("import.importing")} ${selectedPlatform ? t(selectedPlatform.nameKey) : ""}`}
              </h3>
              <p className="text-sm text-zinc-500">
                {t(activeStep.labelKey)}
              </p>

              <div className="mb-4 mt-5 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${
                    selectedPlatform
                      ? commerceChannelBrandStyles[selectedPlatform.id].accentClass
                      : "bg-blue-600"
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

              <div className="space-y-2">
                {importSteps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isDone = index < currentStep;

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all ${
                        isActive
                          ? "bg-zinc-100 dark:bg-zinc-800"
                          : isDone
                            ? "opacity-60"
                            : "opacity-35"
                      }`}
                    >
                      <span
                        className={
                          isActive
                            ? "text-blue-600 dark:text-blue-300"
                            : isDone
                              ? "text-emerald-500"
                              : "text-zinc-400"
                        }
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          step.icon
                        )}
                      </span>
                      <span className="flex-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        {t(step.labelKey)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="py-4 text-center animate-fade-in-up">
              <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-emerald-500" />
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {t("import.complete")}
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                {importCount} {t("import.productsImported")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "default" | "success" | "warning" | "danger";
}) {
  const toneClass = {
    default: "border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-300",
    warning:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-300",
    danger:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-300",
  }[tone];

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <div className="text-xs uppercase tracking-[0.12em] text-current/70">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
