"use client";

import { useState, useMemo } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import GEOTab from "./tabs/GEOTab";
import ChannelsTab from "./tabs/ChannelsTab";
import LaunchTab from "./tabs/LaunchTab";
import { products } from "@/lib/mock";
import { useAuth } from "@/lib/auth/context";
import type { Product } from "@/lib/types";

export default function AppShell() {
  const { user } = useAuth();

  const storeProducts = useMemo(
    () => products.filter((p) => p.category === user?.category),
    [user?.category]
  );

  const [activeTab, setActiveTab] = useState("geo");
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    storeProducts[0]
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          products={storeProducts}
          selectedProduct={selectedProduct}
          onSelectProduct={setSelectedProduct}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-6xl">
            {activeTab === "geo" && (
              <GEOTab product={selectedProduct} />
            )}
            {activeTab === "channels" && (
              <ChannelsTab product={selectedProduct} />
            )}
            {activeTab === "launch" && (
              <LaunchTab product={selectedProduct} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
