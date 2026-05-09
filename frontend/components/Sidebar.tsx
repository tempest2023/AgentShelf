"use client";

import { useState } from "react";
import { ChevronDown, Package } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import type { Product } from "@/lib/types";

interface SidebarProps {
  products: Product[];
  selectedProduct: Product;
  onSelectProduct: (product: Product) => void;
}

export default function Sidebar({
  products,
  selectedProduct,
  onSelectProduct,
}: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const { t } = useLanguage();

  return (
    <aside
      className={`border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col transition-all duration-300 ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Package className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          {expanded && (
            <>
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex-1">
                {t("sidebar.catalog")}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
                  expanded ? "" : "-rotate-90"
                }`}
              />
            </>
          )}
        </button>
      </div>

      {expanded && (
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
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
    </aside>
  );
}
