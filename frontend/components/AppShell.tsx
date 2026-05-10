"use client";

import { useCallback, useMemo, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import GEOTab from "./tabs/GEOTab";
import ChannelsTab from "./tabs/ChannelsTab";
import LaunchTab from "./tabs/LaunchTab";
import SettingsTab from "./tabs/SettingsTab";
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
  const [previousTab, setPreviousTab] = useState("geo");
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    storeProducts[0]
  );
  const [publishStates, setPublishStates] = useState<
    Record<string, ProductPublishState>
  >({});

  const handlePublishStateChange = useCallback((
    productId: string,
    state: ProductPublishState
  ) => {
    setPublishStates((current) => ({
      ...current,
      [productId]: state,
    }));
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab((current) => {
      if (tab === "settings") {
        if (current === "settings") return previousTab;
        setPreviousTab(current);
        return "settings";
      }
      return tab;
    });
  }, [previousTab]);

  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    if (activeTab === "settings") {
      setActiveTab(previousTab);
    }
  }, [activeTab, previousTab]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <Sidebar
          products={storeProducts}
          selectedProduct={selectedProduct}
          onSelectProduct={handleSelectProduct}
          activeTab={activeTab}
          onTabChange={handleTabChange}
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
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}
