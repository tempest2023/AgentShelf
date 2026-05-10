"use client";

import { useState } from "react";
import { Store, Sun, Moon, Languages, LogOut, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const { user, logout } = useAuth();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

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
            onClick={() => setLogoutConfirmOpen(true)}
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

      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setLogoutConfirmOpen(false)}
          />
          <div className="relative w-full max-w-sm mx-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6">
            <button
              onClick={() => setLogoutConfirmOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                {t("logoutConfirm.title")}
              </h3>
              <p className="text-sm text-zinc-500 mb-5">
                {t("logoutConfirm.message")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setLogoutConfirmOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  {t("logoutConfirm.cancel")}
                </button>
                <button
                  onClick={logout}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                >
                  {t("logoutConfirm.confirm")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
