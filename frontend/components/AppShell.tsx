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
import { useAuth } from "@/lib/auth/context";
import { useLanguage } from "@/lib/i18n/context";
import type { Product } from "@/lib/types";
import type {
  GeoGeneratedPanelReadyPayload,
  GeoGeneratedPanelRenderingPayload,
  GeoGeneratedPanelStartPayload,
  GeoGeneratedPanelState,
} from "@/lib/geo-generated-panel";
import { useWorkspace } from "@/lib/workspace/context";

type ProductPublishState = "idle" | "publishing" | "done";

export default function AppShell() {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const { catalogProducts, catalogSource, lastImportAt } = useWorkspace();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [agentSidebarOpen, setAgentSidebarOpen] = useState(false);
  const [generatedPanels, setGeneratedPanels] = useState<
    Record<string, GeoGeneratedPanelState | null>
  >({});
  const storeProducts = catalogProducts;

  const [activeTab, setActiveTab] = useState("geo");
  const [previousTab, setPreviousTab] = useState("geo");
  const [selectedProductId, setSelectedProductId] = useState(
    storeProducts[0]?.id ?? ""
  );
  const [publishStates, setPublishStates] = useState<
    Record<string, ProductPublishState>
  >({});
  const selectedProduct = useMemo(
    () =>
      storeProducts.find((product) => product.id === selectedProductId) ??
      storeProducts[0],
    [selectedProductId, storeProducts]
  );

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
    setSelectedProductId(product.id);
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
    ({
      productId,
      query,
      runId,
      chart,
      execution,
    }: GeoGeneratedPanelReadyPayload) => {
      setGeneratedPanels((current) => {
        const previous = current[productId];

        if (previous && previous.runId !== runId) {
          return current;
        }

        if (previous?.runId === runId && previous.status === "ready") {
          return current;
        }

        return {
          ...current,
          [productId]: {
            id: previous?.id ?? runId,
            runId,
            productId,
            query,
            chart,
            execution,
            status: "ready",
            createdAt: previous?.createdAt ?? Date.now(),
            updatedAt: Date.now(),
          },
        };
      });
    },
    []
  );

  const handleGeneratedPanelRendering = useCallback(
    ({
      productId,
      query,
      runId,
      chart,
      execution,
    }: GeoGeneratedPanelRenderingPayload) => {
      setGeneratedPanels((current) => {
        const previous = current[productId];

        if (previous && previous.runId !== runId) {
          return current;
        }

        if (previous?.runId === runId && previous.status === "rendering") {
          return current;
        }

        return {
          ...current,
          [productId]: {
            id: previous?.id ?? runId,
            runId,
            productId,
            query,
            chart,
            execution,
            status: "rendering",
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
          catalogSource={catalogSource}
          lastImportAt={lastImportAt}
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
                key={selectedProduct.id}
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
          onGeneratedPanelRendering={handleGeneratedPanelRendering}
          onGeneratedPanelReady={handleGeneratedPanelReady}
        />
      )}
    </div>
  );
}
