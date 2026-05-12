"use client";

import { useCallback, useMemo, useState } from "react";
import { LogOut } from "lucide-react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ConfirmModal from "./ConfirmModal";
import GEOTab from "./tabs/GEOTab";
import ChannelsTab from "./tabs/ChannelsTab";
import LaunchTab from "./tabs/LaunchTab";
import SettingsTab from "./tabs/SettingsTab";
import GeoAgentSidebar from "./geo/GeoAgentSidebar";
import { products } from "@/lib/mock";
import { useAuth } from "@/lib/auth/context";
import { useLanguage } from "@/lib/i18n/context";
import type { Product } from "@/lib/types";
import type {
  GeoGeneratedPanelReadyPayload,
  GeoGeneratedPanelStartPayload,
  GeoGeneratedPanelState,
} from "@/lib/geo-generated-panel";

type ProductPublishState = "idle" | "publishing" | "done";

export default function AppShell() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [agentSidebarOpen, setAgentSidebarOpen] = useState(false);
  const [generatedPanels, setGeneratedPanels] = useState<
    Record<string, GeoGeneratedPanelState | null>
  >({});

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

  const handleLogoutRequest = useCallback(() => {
    setLogoutConfirmOpen(true);
  }, []);

  const handleLogoutConfirm = useCallback(() => {
    setLogoutConfirmOpen(false);
    logout();
  }, [logout]);

  const handleGeneratedPanelStart = useCallback(
    ({ productId, query, runId }: GeoGeneratedPanelStartPayload) => {
      setGeneratedPanels((current) => ({
        ...current,
        [productId]: {
          id: runId,
          runId,
          productId,
          query,
          status: "generating",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      }));
    },
    []
  );

  const handleGeneratedPanelReady = useCallback(
    ({ productId, query, runId, chart }: GeoGeneratedPanelReadyPayload) => {
      setGeneratedPanels((current) => {
        const previous = current[productId];

        return {
          ...current,
          [productId]: {
            id: previous?.id ?? runId,
            runId,
            productId,
            query,
            chart,
            status: "ready",
            createdAt: previous?.createdAt ?? Date.now(),
            updatedAt: Date.now(),
          },
        };
      });
    },
    []
  );

  const handleDismissGeneratedPanel = useCallback((productId: string) => {
    setGeneratedPanels((current) => ({
      ...current,
      [productId]: null,
    }));
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header activeTab={activeTab} onTabChange={handleTabChange} onLogoutRequest={handleLogoutRequest} />
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <Sidebar
          products={storeProducts}
          selectedProduct={selectedProduct}
          onSelectProduct={handleSelectProduct}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <main
          className={`flex-1 overflow-y-auto transition-[margin] duration-300 ease-in-out ${
            activeTab === "geo" && agentSidebarOpen
              ? "min-[1180px]:mr-[420px] xl:mr-[440px]"
              : "min-[1180px]:mr-0 xl:mr-0"
          }`}
        >
          <div className="max-w-6xl p-4 sm:p-6">
            {activeTab === "geo" && (
              <GEOTab
                product={selectedProduct}
                generatedPanel={generatedPanels[selectedProduct.id] ?? null}
                onDismissGeneratedPanel={() =>
                  handleDismissGeneratedPanel(selectedProduct.id)
                }
              />
            )}
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

      {logoutConfirmOpen && (
        <ConfirmModal
          onClose={() => setLogoutConfirmOpen(false)}
          onConfirm={handleLogoutConfirm}
          title={t("logoutConfirm.title")}
          message={t("logoutConfirm.message")}
          confirmLabel={t("logoutConfirm.confirm")}
          cancelLabel={t("logoutConfirm.cancel")}
          icon={<LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />}
          variant="danger"
        />
      )}

      {activeTab === "geo" && (
        <GeoAgentSidebar
          open={agentSidebarOpen}
          onToggle={() => setAgentSidebarOpen((prev) => !prev)}
          selectedProduct={selectedProduct}
          onGeneratedPanelStart={handleGeneratedPanelStart}
          onGeneratedPanelReady={handleGeneratedPanelReady}
        />
      )}
    </div>
  );
}
