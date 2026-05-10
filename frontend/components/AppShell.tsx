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

type ProductPublishState = "idle" | "publishing" | "done";

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
  const [publishStates, setPublishStates] = useState<
    Record<string, ProductPublishState>
  >({});

  const handlePublishStateChange = (
    productId: string,
    state: ProductPublishState
  ) => {
    setPublishStates((current) => ({
      ...current,
      [productId]: state,
    }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <Sidebar
          products={storeProducts}
          selectedProduct={selectedProduct}
          onSelectProduct={setSelectedProduct}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl p-4 sm:p-6">
            {activeTab === "geo" && <GEOTab product={selectedProduct} />}
            {activeTab === "channels" && (
              <ChannelsTab product={selectedProduct} />
            )}
            {activeTab === "launch" && (
              <LaunchTab
                key={selectedProduct.id}
                product={selectedProduct}
                publishState={publishStates[selectedProduct.id] ?? "idle"}
                onPublishStateChange={handlePublishStateChange}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
