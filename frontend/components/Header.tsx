"use client";

import { useState, useEffect } from "react";
import { Store, Sun, Moon, Languages, LogOut, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import ImportModal from "./ImportModal";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const tabs = [
    { id: "geo", label: t("header.tab.geo") },
    { id: "channels", label: t("header.tab.channels") },
    { id: "launch", label: t("header.tab.launch") },
  ];

  const storeName = user
    ? locale === "zh"
      ? user.storeNameZh
      : user.storeName
    : "";

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Store className="w-5 h-5" />
            <span className="font-semibold text-base tracking-tight">AgentShelf</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-600 text-sm hidden sm:inline">|</span>
          <span className="text-zinc-700 dark:text-zinc-300 text-sm font-medium hidden sm:inline">{storeName}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocale(locale === "en" ? "zh" : "en")}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 text-xs font-medium"
            aria-label="Toggle language"
          >
            <Languages className="w-3.5 h-3.5" />
            {locale === "en" ? "中文" : "EN"}
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 text-xs font-medium"
            aria-label={t("header.importData")}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("header.importData")}</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 text-xs font-medium"
            aria-label={t("header.logout")}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("header.logout")}</span>
          </button>
        </div>
      </div>

      <nav className="flex px-6 gap-1 -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <ImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} />
    </header>
  );
}
