"use client";

import { Store, Sun, Moon, Languages, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogoutRequest: () => void;
}

export default function Header({ activeTab, onTabChange, onLogoutRequest }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const { user } = useAuth();

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
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
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
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
            aria-label="Toggle language"
          >
            <Languages className="h-4 w-4" />
          </button>

          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
            aria-label="Toggle theme"
          >
            <Sun className="hidden h-4 w-4 dark:block" />
            <Moon className="h-4 w-4 dark:hidden" />
          </button>

          <button
            onClick={onLogoutRequest}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
            aria-label={t("header.logout")}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav className="-mb-px flex gap-1 overflow-x-auto px-4 sm:px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
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
