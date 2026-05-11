"use client";

import { useEffect, useCallback } from "react";
import { Bot, X } from "lucide-react";
import type { Product } from "@/lib/types";
import GeoAgentPanel from "./GeoAgentPanel";

interface GeoAgentSidebarProps {
  open: boolean;
  onToggle: () => void;
  selectedProduct: Product;
}

export default function GeoAgentSidebar({
  open,
  onToggle,
  selectedProduct,
}: GeoAgentSidebarProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onToggle();
      }
    },
    [open, onToggle]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Overlay on small screens */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm xl:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 transition-transform duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-zinc-900/50 sm:w-[440px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                GEO Agent
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                CopilotKit
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Close GEO Agent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex min-h-0 w-full flex-1 items-stretch overflow-hidden bg-zinc-50/80 dark:bg-zinc-950">
          <GeoAgentPanel key={selectedProduct.id} selectedProduct={selectedProduct} />
        </div>
      </aside>

      {/* Floating toggle button */}
      {!open && (
        <button
          type="button"
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/30 hover:scale-105 active:scale-95 dark:bg-blue-500 dark:shadow-blue-500/20 dark:hover:bg-blue-400"
          title="Open GEO Agent"
          aria-label="Open GEO Agent"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}
    </>
  );
}
