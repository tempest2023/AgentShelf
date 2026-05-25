"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import ImportModal from "@/components/ImportModal";
import Badge from "@/components/Badge";
import { useWorkspace } from "@/lib/workspace/context";

export default function SettingsTab() {
  const { t, locale } = useLanguage();
  const [importOpen, setImportOpen] = useState(false);
  const {
    analyticsCounts,
    catalogProducts,
    catalogSource,
    lastImportAt,
    lastImportSource,
    recentEvents,
  } = useWorkspace();
  const formattedLastImport = lastImportAt
    ? new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(lastImportAt))
    : null;
  const eventLabels = {
    login: t("settings.analytics.login"),
    import: t("settings.analytics.import"),
    audit_run: t("settings.analytics.audit"),
    query_run: t("settings.analytics.query"),
    agent_open: t("settings.analytics.agent"),
    asset_export: t("settings.analytics.asset"),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {t("sidebar.settings")}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {t("settings.subtitle")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant={catalogSource === "workspace" ? "success" : "warning"}>
              {catalogSource === "workspace"
                ? t("sidebar.catalogImported")
                : t("sidebar.catalogFallback")}
            </Badge>
            <span className="text-xs text-zinc-500">
              {catalogProducts.length} {t("sidebar.products")}
            </span>
          </div>

          <h2 className="mb-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {t("settings.dataManagement")}
          </h2>
          <p className="text-xs text-zinc-500 mb-4">
            {t("settings.dataManagementDesc")}
          </p>
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <InfoCard
              label={t("settings.catalogSource")}
              value={
                catalogSource === "workspace"
                  ? t("settings.source.workspace")
                  : t("settings.source.fallback")
              }
            />
            <InfoCard
              label={t("settings.lastImport")}
              value={formattedLastImport ?? t("settings.notImported")}
            />
            <InfoCard
              label={t("settings.importMethod")}
              value={
                lastImportSource
                  ? lastImportSource === "csv-upload"
                    ? "CSV"
                    : lastImportSource
                  : "—"
              }
            />
          </div>
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            {t("header.importData")}
          </button>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {t("settings.analyticsTitle")}
          </h2>
          <p className="mb-4 text-xs text-zinc-500">
            {t("settings.analyticsDesc")}
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(analyticsCounts).map(([key, value]) => (
              <InfoCard
                key={key}
                label={eventLabels[key as keyof typeof eventLabels]}
                value={`${value}`}
              />
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="border-b border-zinc-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
              {t("settings.recentActivity")}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {recentEvents.length === 0 ? (
                <div className="px-4 py-5 text-sm text-zinc-500">
                  {t("settings.noActivity")}
                </div>
              ) : (
                recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border-b border-zinc-100 px-4 py-3 text-sm last:border-b-0 dark:border-zinc-800/70"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {eventLabels[event.type]}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {new Intl.DateTimeFormat(
                          locale === "zh" ? "zh-CN" : "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        ).format(new Date(event.createdAt))}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {Object.entries(event.metadata)
                        .filter(([, metadataValue]) => metadataValue !== null)
                        .map(([metadataKey, metadataValue]) => `${metadataKey}: ${metadataValue}`)
                        .join(" · ")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {importOpen && <ImportModal onClose={() => setImportOpen(false)} />}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
      <div className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {value}
      </div>
    </div>
  );
}
