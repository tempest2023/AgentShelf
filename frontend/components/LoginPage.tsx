"use client";

import { Store, Laptop, Mountain, Dog, Heart, Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth, MOCK_USERS } from "@/lib/auth/context";
import { products } from "@/lib/mock";
import type { Category } from "@/lib/types";
import { useState, useEffect } from "react";

const categoryIcons: Record<Category, React.ReactNode> = {
  electronics: <Laptop className="w-5 h-5" />,
  outdoor: <Mountain className="w-5 h-5" />,
  pets: <Dog className="w-5 h-5" />,
  health: <Heart className="w-5 h-5" />,
};

const categoryColors: Record<Category, { bg: string; text: string; border: string; hover: string }> = {
  electronics: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    hover: "hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-blue-100 dark:hover:shadow-blue-900/20",
  },
  outdoor: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    hover: "hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-emerald-100 dark:hover:shadow-emerald-900/20",
  },
  pets: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    hover: "hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-amber-100 dark:hover:shadow-amber-900/20",
  },
  health: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
    hover: "hover:border-rose-400 dark:hover:border-rose-600 hover:shadow-rose-100 dark:hover:shadow-rose-900/20",
  },
};

const categoryTranslationKeys: Record<Category, string> = {
  electronics: "login.electronics",
  outdoor: "login.outdoor",
  pets: "login.pets",
  health: "login.health",
};

export default function LoginPage() {
  const { login } = useAuth();
  const { locale, setLocale, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
        >
          {mounted && theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-2xl">
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
              {t("login.title")}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("login.subtitle")}
            </p>
          </div>

          {/* Account cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_USERS.map((user) => {
              const colors = categoryColors[user.category];
              const productCount = products.filter((p) => p.category === user.category).length;

              return (
                <button
                  key={user.id}
                  onClick={() => login(user.id)}
                  className={`group relative text-left p-5 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md ${colors.bg} ${colors.border} ${colors.hover}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold text-base flex-shrink-0 ${colors.text} bg-white dark:bg-zinc-800 border ${colors.border}`}>
                      {user.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm mb-0.5 truncate">
                        {locale === "zh" ? user.storeNameZh : user.storeName}
                      </div>
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className={colors.text}>{categoryIcons[user.category]}</span>
                        <span className={`text-xs font-medium ${colors.text}`}>
                          {t(categoryTranslationKeys[user.category] as any)}
                        </span>
                        <span className="text-xs text-zinc-400">
                          &middot; {productCount} {t("login.products")}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 dark:text-zinc-500">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Arrow hint */}
                  <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className={`w-5 h-5 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
