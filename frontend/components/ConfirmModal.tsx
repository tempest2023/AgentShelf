"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  icon?: ReactNode;
  variant?: "danger" | "default";
}

export default function ConfirmModal({
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  icon,
  variant = "default",
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm mx-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="text-center">
          {icon && (
            <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full ${
              variant === "danger"
                ? "bg-red-100 dark:bg-red-900/30"
                : "bg-blue-100 dark:bg-blue-900/30"
            }`}>
              {icon}
            </div>
          )}
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            {title}
          </h3>
          <p className="text-sm text-zinc-500 mb-5">
            {message}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
                variant === "danger"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
