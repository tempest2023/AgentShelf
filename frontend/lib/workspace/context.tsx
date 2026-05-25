"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth/context";
import { products as mockProducts } from "@/lib/mock";
import type { Product, ProductAudit, QuerySimulation } from "@/lib/types";
import {
  WORKSPACE_STORAGE_KEY,
  appendAnalyticsEvent,
  ensureWorkspaceStore,
  getLatestAuditRun as getLatestStoredAuditRun,
  getLatestQueryRun as getLatestStoredQueryRun,
  getWorkspaceAnalyticsSummary,
  getWorkspaceProducts,
  getWorkspaceStore,
  readWorkspaceSnapshot,
  recordAuditRun as persistAuditRun,
  recordGeneratedAsset,
  recordQueryRun as persistQueryRun,
  replaceWorkspaceProducts,
} from "@/lib/workspace/storage";
import type {
  WorkspaceAnalyticsEventRecord,
  WorkspaceAnalyticsEventType,
  WorkspaceAuditRunRecord,
  WorkspaceGeneratedAssetType,
  WorkspaceImportSource,
  WorkspaceQueryRunRecord,
  WorkspaceSnapshot,
} from "@/lib/workspace/types";

interface WorkspaceContextValue {
  snapshot: WorkspaceSnapshot;
  storeId: string | null;
  catalogProducts: Product[];
  catalogSource: "workspace" | "mock-fallback";
  lastImportAt?: string;
  lastImportSource?: WorkspaceImportSource;
  importProducts: (products: Product[]) => number;
  seedStoreCatalog: (source: Exclude<WorkspaceImportSource, "csv-upload">) => number;
  getLatestAuditRun: (productId: string) => WorkspaceAuditRunRecord | null;
  getLatestQueryRun: (
    productId: string,
    query?: string
  ) => WorkspaceQueryRunRecord | null;
  recordAuditRun: (params: {
    productId: string;
    audit: ProductAudit;
    statusMode: WorkspaceAuditRunRecord["statusMode"];
    statusMessage: string;
    model: string;
    error?: string;
  }) => void;
  recordQueryRun: (params: {
    productId: string;
    query: string;
    simulation: QuerySimulation;
    statusMode: WorkspaceQueryRunRecord["statusMode"];
    statusMessage: string;
    model: string;
    error?: string;
  }) => void;
  recordAssetExport: (params: {
    productId: string;
    type: WorkspaceGeneratedAssetType;
    title: string;
    content: string;
  }) => void;
  trackEvent: (
    type: WorkspaceAnalyticsEventType,
    metadata: Record<string, string | number | boolean | null>
  ) => void;
  analyticsCounts: Record<WorkspaceAnalyticsEventType, number>;
  recentEvents: WorkspaceAnalyticsEventRecord[];
}

const WorkspaceContext = createContext<WorkspaceContextValue>({
  snapshot: readWorkspaceSnapshot(),
  storeId: null,
  catalogProducts: [],
  catalogSource: "mock-fallback",
  importProducts: () => 0,
  seedStoreCatalog: () => 0,
  getLatestAuditRun: () => null,
  getLatestQueryRun: () => null,
  recordAuditRun: () => {},
  recordQueryRun: () => {},
  recordAssetExport: () => {},
  trackEvent: () => {},
  analyticsCounts: {
    login: 0,
    import: 0,
    audit_run: 0,
    query_run: 0,
    agent_open: 0,
    asset_export: 0,
  },
  recentEvents: [],
});

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [snapshot, setSnapshot] = useState<WorkspaceSnapshot>(() =>
    readWorkspaceSnapshot()
  );
  const lastTrackedLoginRef = useRef<string | null>(null);

  const updateSnapshot = useCallback(
    (mutator: (current: WorkspaceSnapshot) => WorkspaceSnapshot) => {
      setSnapshot((current) => {
        const next = mutator(current);
        window.localStorage.setItem(
          WORKSPACE_STORAGE_KEY,
          JSON.stringify(next)
        );
        return next;
      });
    },
    []
  );

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === WORKSPACE_STORAGE_KEY) {
        setSnapshot(readWorkspaceSnapshot());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!user) {
      lastTrackedLoginRef.current = null;
      return;
    }

    updateSnapshot((current) => {
      const ensured = ensureWorkspaceStore(current, user);
      if (lastTrackedLoginRef.current === user.storeId) {
        return ensured;
      }

      lastTrackedLoginRef.current = user.storeId;
      return appendAnalyticsEvent({
        snapshot: ensured,
        storeId: user.storeId,
        type: "login",
        metadata: {
          userId: user.id,
          category: user.category,
        },
      });
    });
  }, [updateSnapshot, user]);

  const currentStore = useMemo(() => {
    const existingStore = getWorkspaceStore(snapshot, user?.storeId);
    if (existingStore) {
      return existingStore;
    }

    if (!user) {
      return null;
    }

    return {
      id: user.storeId,
      userId: user.id,
      name: user.storeName,
      nameZh: user.storeNameZh,
      category: user.category,
    };
  }, [snapshot, user]);
  const storeId = currentStore?.id ?? user?.storeId ?? null;
  const persistedProducts = useMemo(
    () => getWorkspaceProducts(snapshot, storeId),
    [snapshot, storeId]
  );
  const fallbackProducts = useMemo(
    () =>
      user ? mockProducts.filter((product) => product.category === user.category) : [],
    [user]
  );
  const catalogProducts = persistedProducts.length > 0 ? persistedProducts : fallbackProducts;
  const catalogSource = persistedProducts.length > 0 ? "workspace" : "mock-fallback";

  const importProducts = useCallback(
    (products: Product[]) => {
      if (!currentStore) {
        return 0;
      }

      const count = products.length;
      updateSnapshot((current) => {
        const withProducts = replaceWorkspaceProducts({
          snapshot: current,
          store: currentStore,
          products,
          importSource: "csv-upload",
        });

        return appendAnalyticsEvent({
          snapshot: withProducts,
          storeId: currentStore.id,
          type: "import",
          metadata: {
            source: "csv-upload",
            count,
          },
        });
      });

      return count;
    },
    [currentStore, updateSnapshot]
  );

  const seedStoreCatalog = useCallback(
    (source: Exclude<WorkspaceImportSource, "csv-upload">) => {
      if (!currentStore || !user) {
        return 0;
      }

      const seededProducts = mockProducts.filter(
        (product) => product.category === user.category
      );
      const count = seededProducts.length;

      updateSnapshot((current) => {
        const withProducts = replaceWorkspaceProducts({
          snapshot: current,
          store: currentStore,
          products: seededProducts,
          importSource: source,
        });

        return appendAnalyticsEvent({
          snapshot: withProducts,
          storeId: currentStore.id,
          type: "import",
          metadata: {
            source,
            count,
          },
        });
      });

      return count;
    },
    [currentStore, updateSnapshot, user]
  );

  const getLatestAuditRun = useCallback(
    (productId: string) => getLatestStoredAuditRun(snapshot, storeId, productId),
    [snapshot, storeId]
  );

  const getLatestQueryRun = useCallback(
    (productId: string, query?: string) =>
      getLatestStoredQueryRun(snapshot, storeId, productId, query),
    [snapshot, storeId]
  );

  const trackEvent = useCallback(
    (
      type: WorkspaceAnalyticsEventType,
      metadata: Record<string, string | number | boolean | null>
    ) => {
      if (!storeId) {
        return;
      }

      updateSnapshot((current) =>
        appendAnalyticsEvent({
          snapshot: current,
          storeId,
          type,
          metadata,
        })
      );
    },
    [storeId, updateSnapshot]
  );

  const recordAuditRun = useCallback(
    ({
      productId,
      audit,
      statusMode,
      statusMessage,
      model,
      error,
    }: {
      productId: string;
      audit: ProductAudit;
      statusMode: WorkspaceAuditRunRecord["statusMode"];
      statusMessage: string;
      model: string;
      error?: string;
    }) => {
      if (!storeId) {
        return;
      }

      updateSnapshot((current) => {
        const withRun = persistAuditRun({
          snapshot: current,
          storeId,
          productId,
          audit,
          statusMode,
          statusMessage,
          model,
          error,
        });

        return appendAnalyticsEvent({
          snapshot: withRun,
          storeId,
          type: "audit_run",
          metadata: {
            productId,
            mode: statusMode,
          },
        });
      });
    },
    [storeId, updateSnapshot]
  );

  const recordQueryRun = useCallback(
    ({
      productId,
      query,
      simulation,
      statusMode,
      statusMessage,
      model,
      error,
    }: {
      productId: string;
      query: string;
      simulation: QuerySimulation;
      statusMode: WorkspaceQueryRunRecord["statusMode"];
      statusMessage: string;
      model: string;
      error?: string;
    }) => {
      if (!storeId) {
        return;
      }

      updateSnapshot((current) => {
        const withRun = persistQueryRun({
          snapshot: current,
          storeId,
          productId,
          query,
          simulation,
          statusMode,
          statusMessage,
          model,
          error,
        });

        return appendAnalyticsEvent({
          snapshot: withRun,
          storeId,
          type: "query_run",
          metadata: {
            productId,
            mode: statusMode,
            query,
          },
        });
      });
    },
    [storeId, updateSnapshot]
  );

  const recordAssetExport = useCallback(
    ({
      productId,
      type,
      title,
      content,
    }: {
      productId: string;
      type: WorkspaceGeneratedAssetType;
      title: string;
      content: string;
    }) => {
      if (!storeId) {
        return;
      }

      updateSnapshot((current) => {
        const withAsset = recordGeneratedAsset({
          snapshot: current,
          storeId,
          productId,
          type,
          title,
          content,
        });

        return appendAnalyticsEvent({
          snapshot: withAsset,
          storeId,
          type: "asset_export",
          metadata: {
            productId,
            assetType: type,
            title,
          },
        });
      });
    },
    [storeId, updateSnapshot]
  );

  const analyticsSummary = useMemo(
    () => getWorkspaceAnalyticsSummary(snapshot, storeId),
    [snapshot, storeId]
  );

  return (
    <WorkspaceContext.Provider
      value={{
        snapshot,
        storeId,
        catalogProducts,
        catalogSource,
        lastImportAt: currentStore?.lastImportAt,
        lastImportSource: currentStore?.lastImportSource,
        importProducts,
        seedStoreCatalog,
        getLatestAuditRun,
        getLatestQueryRun,
        recordAuditRun,
        recordQueryRun,
        recordAssetExport,
        trackEvent,
        analyticsCounts: analyticsSummary.counts,
        recentEvents: analyticsSummary.events,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
