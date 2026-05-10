"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import ImportModal from "@/components/ImportModal";

export default function SettingsTab() {
  const { t } = useLanguage();
  const [importOpen, setImportOpen] = useState(false);

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
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
            {t("settings.dataManagement")}
          </h2>
          <p className="text-xs text-zinc-500 mb-4">
            {t("settings.dataManagementDesc")}
          </p>
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            {t("header.importData")}
          </button>
        </div>
      </div>

      {importOpen && <ImportModal onClose={() => setImportOpen(false)} />}
    </div>
  );
}
