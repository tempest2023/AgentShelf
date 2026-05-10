"use client";

import { useState } from "react";
import { ChevronDown, Package, Settings } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import type { Product } from "@/lib/types";

interface SidebarProps {
  products: Product[];
  selectedProduct: Product;
  onSelectProduct: (product: Product) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({
  products,
  selectedProduct,
  onSelectProduct,
  activeTab,
  onTabChange,
}: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const { t } = useLanguage();

  return (
    <aside
      className={`w-full shrink-0 flex flex-col border-b border-zinc-200 bg-zinc-50 transition-[width] duration-300 dark:border-zinc-800 dark:bg-zinc-900/50 md:border-b-0 md:border-r ${
        expanded ? "md:w-64" : "md:w-16"
      }`}
    >
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Package className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          <span
            className={`flex-1 text-xs font-medium uppercase tracking-wider text-zinc-400 ${
              expanded ? "" : "md:hidden"
            }`}
          >
            {t("sidebar.catalog")}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
              expanded ? "" : "-rotate-90"
            }`}
          />
        </button>
      </div>

      {expanded && (
        <div className="max-h-56 overflow-y-auto p-2 space-y-0.5 md:max-h-none md:flex-1">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                selectedProduct.id === product.id
                  ? "bg-blue-500/15 border border-blue-500/30"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800/70 border border-transparent"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    selectedProduct.id === product.id
                      ? "bg-blue-400"
                      : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                />
                <div className="min-w-0">
                  <div
                    className={`text-sm font-medium truncate ${
                      selectedProduct.id === product.id
                        ? "text-blue-600 dark:text-blue-300"
                        : "text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {product.title}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {product.brand} &middot; ${product.price}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-zinc-200 dark:border-zinc-800 p-2 mt-auto">
        <button
          onClick={() => onTabChange("settings")}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors ${
            activeTab === "settings"
              ? "bg-blue-500/15 border border-blue-500/30"
              : "hover:bg-zinc-100 dark:hover:bg-zinc-800/70 border border-transparent"
          }`}
        >
          <Settings className={`w-4 h-4 flex-shrink-0 ${
            activeTab === "settings"
              ? "text-blue-500"
              : "text-zinc-400"
          }`} />
          <span className={`text-sm font-medium ${
            activeTab === "settings"
              ? "text-blue-600 dark:text-blue-300"
              : "text-zinc-700 dark:text-zinc-300"
          } ${expanded ? "" : "md:hidden"}`}>
            {t("sidebar.settings")}
          </span>
        </button>
      </div>
    </aside>
  );
}
