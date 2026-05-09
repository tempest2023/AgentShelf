"use client";

import { useState, useEffect } from "react";
import { Store, Zap, Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/i18n/context";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const tabs = [
    { id: "geo", label: t("header.tab.geo") },
    { id: "channels", label: t("header.tab.channels") },
    { id: "launch", label: t("header.tab.launch") },
  ];

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Store className="w-5 h-5" />
            <span className="font-semibold text-base tracking-tight">AgentShelf</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-600 text-sm hidden sm:inline">|</span>
          <span className="text-zinc-400 dark:text-zinc-500 text-sm hidden sm:inline">{t("header.subtitle")}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <Zap className="w-3 h-3" />
            <span>{t("header.demoMode")}</span>
          </div>

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
    </header>
  );
}
