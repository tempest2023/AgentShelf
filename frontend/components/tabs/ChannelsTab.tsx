"use client";

import type { Product } from "@/lib/types";

export default function ChannelsTab({ product }: { product: Product }) {
  return (
    <div className="animate-fade-in-up">
      <h1 className="text-xl font-bold text-zinc-100 mb-1">
        AI Commerce Channels
      </h1>
      <p className="text-sm text-zinc-500 mb-6">
        Analyzing: <span className="text-zinc-300">{product.title}</span>
      </p>
      <div className="text-zinc-500">Loading...</div>
    </div>
  );
}
