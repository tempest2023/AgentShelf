"use client";

import type { MockUser } from "@/lib/auth/context";
import type { Product } from "@/lib/types";
import type {
  WorkspaceAIStatusMode,
  WorkspaceAnalyticsEventRecord,
  WorkspaceAnalyticsEventType,
  WorkspaceAuditRunRecord,
  WorkspaceGeneratedAssetRecord,
  WorkspaceGeneratedAssetType,
  WorkspaceImportSource,
  WorkspaceProductRecord,
  WorkspaceQueryRunRecord,
  WorkspaceSnapshot,
  WorkspaceStoreRecord,
} from "@/lib/workspace/types";

export const WORKSPACE_STORAGE_KEY = "agentshelf-workspace-v1";
const MAX_AUDIT_RUNS = 120;
const MAX_QUERY_RUNS = 120;
const MAX_GENERATED_ASSETS = 120;
const MAX_ANALYTICS_EVENTS = 300;

function createEmptySnapshot(): WorkspaceSnapshot {
  return {
    version: 1,
    stores: [],
    products: [],
    auditRuns: [],
    queryRuns: [],
    generatedAssets: [],
    analyticsEvents: [],
  };
}

function isSnapshot(candidate: unknown): candidate is WorkspaceSnapshot {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }

  const snapshot = candidate as Partial<WorkspaceSnapshot>;

  return (
    snapshot.version === 1 &&
    Array.isArray(snapshot.stores) &&
    Array.isArray(snapshot.products) &&
    Array.isArray(snapshot.auditRuns) &&
    Array.isArray(snapshot.queryRuns) &&
    Array.isArray(snapshot.generatedAssets) &&
    Array.isArray(snapshot.analyticsEvents)
  );
}

export function readWorkspaceSnapshot(): WorkspaceSnapshot {
  if (typeof window === "undefined") {
    return createEmptySnapshot();
  }

  try {
    const raw = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) {
      return createEmptySnapshot();
    }

    const parsed = JSON.parse(raw) as unknown;
    return isSnapshot(parsed) ? parsed : createEmptySnapshot();
  } catch {
    return createEmptySnapshot();
  }
}

export function writeWorkspaceSnapshot(snapshot: WorkspaceSnapshot) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(snapshot));
}

export function ensureWorkspaceStore(
  snapshot: WorkspaceSnapshot,
  user: MockUser
): WorkspaceSnapshot {
  if (snapshot.stores.some((store) => store.id === user.storeId)) {
    return snapshot;
  }

  const nextStore: WorkspaceStoreRecord = {
    id: user.storeId,
    userId: user.id,
    name: user.storeName,
    nameZh: user.storeNameZh,
    category: user.category,
  };

  return {
    ...snapshot,
    stores: [...snapshot.stores, nextStore],
  };
}

export function getWorkspaceStore(
  snapshot: WorkspaceSnapshot,
  storeId: string | null | undefined
) {
  if (!storeId) {
    return null;
  }

  return snapshot.stores.find((store) => store.id === storeId) ?? null;
}

export function getWorkspaceProducts(
  snapshot: WorkspaceSnapshot,
  storeId: string | null | undefined
) {
  if (!storeId) {
    return [];
  }

  return snapshot.products.filter((product) => product.storeId === storeId);
}

export function replaceWorkspaceProducts({
  snapshot,
  store,
  products,
  importSource,
  importedAt = new Date().toISOString(),
}: {
  snapshot: WorkspaceSnapshot;
  store: WorkspaceStoreRecord;
  products: Product[];
  importSource: WorkspaceImportSource;
  importedAt?: string;
}): WorkspaceSnapshot {
  const nextProducts: WorkspaceProductRecord[] = products.map((product) => ({
    ...product,
    storeId: store.id,
    importedAt,
    importSource,
  }));

  const nextStores = snapshot.stores.map((existingStore) =>
    existingStore.id === store.id
      ? {
          ...existingStore,
          lastImportAt: importedAt,
          lastImportSource: importSource,
        }
      : existingStore
  );

  return {
    ...snapshot,
    stores: nextStores,
    products: [
      ...snapshot.products.filter((product) => product.storeId !== store.id),
      ...nextProducts,
    ],
  };
}

function prependAndLimit<T extends { createdAt?: string; exportedAt?: string }>(
  entries: T[],
  limit: number
) {
  return entries
    .slice()
    .sort((left, right) => {
      const leftDate = left.createdAt ?? left.exportedAt ?? "";
      const rightDate = right.createdAt ?? right.exportedAt ?? "";
      return rightDate.localeCompare(leftDate);
    })
    .slice(0, limit);
}

export function appendAnalyticsEvent({
  snapshot,
  storeId,
  type,
  metadata,
  createdAt = new Date().toISOString(),
}: {
  snapshot: WorkspaceSnapshot;
  storeId: string;
  type: WorkspaceAnalyticsEventType;
  metadata: Record<string, string | number | boolean | null>;
  createdAt?: string;
}): WorkspaceSnapshot {
  const event: WorkspaceAnalyticsEventRecord = {
    id: crypto.randomUUID(),
    storeId,
    type,
    createdAt,
    metadata,
  };

  return {
    ...snapshot,
    analyticsEvents: prependAndLimit(
      [event, ...snapshot.analyticsEvents],
      MAX_ANALYTICS_EVENTS
    ),
  };
}

export function recordAuditRun({
  snapshot,
  storeId,
  productId,
  audit,
  statusMode,
  statusMessage,
  model,
  error,
  createdAt = new Date().toISOString(),
}: {
  snapshot: WorkspaceSnapshot;
  storeId: string;
  productId: string;
  audit: WorkspaceAuditRunRecord["audit"];
  statusMode: WorkspaceAIStatusMode;
  statusMessage: string;
  model: string;
  error?: string;
  createdAt?: string;
}): WorkspaceSnapshot {
  const run: WorkspaceAuditRunRecord = {
    id: crypto.randomUUID(),
    storeId,
    productId,
    createdAt,
    statusMode,
    statusMessage,
    model,
    error,
    audit,
  };

  return {
    ...snapshot,
    auditRuns: prependAndLimit([run, ...snapshot.auditRuns], MAX_AUDIT_RUNS),
  };
}

export function recordQueryRun({
  snapshot,
  storeId,
  productId,
  query,
  simulation,
  statusMode,
  statusMessage,
  model,
  error,
  createdAt = new Date().toISOString(),
}: {
  snapshot: WorkspaceSnapshot;
  storeId: string;
  productId: string;
  query: string;
  simulation: WorkspaceQueryRunRecord["simulation"];
  statusMode: WorkspaceAIStatusMode;
  statusMessage: string;
  model: string;
  error?: string;
  createdAt?: string;
}): WorkspaceSnapshot {
  const run: WorkspaceQueryRunRecord = {
    id: crypto.randomUUID(),
    storeId,
    productId,
    query,
    createdAt,
    statusMode,
    statusMessage,
    model,
    error,
    simulation,
  };

  return {
    ...snapshot,
    queryRuns: prependAndLimit([run, ...snapshot.queryRuns], MAX_QUERY_RUNS),
  };
}

export function recordGeneratedAsset({
  snapshot,
  storeId,
  productId,
  type,
  title,
  content,
  exportedAt = new Date().toISOString(),
}: {
  snapshot: WorkspaceSnapshot;
  storeId: string;
  productId: string;
  type: WorkspaceGeneratedAssetType;
  title: string;
  content: string;
  exportedAt?: string;
}): WorkspaceSnapshot {
  const asset: WorkspaceGeneratedAssetRecord = {
    id: crypto.randomUUID(),
    storeId,
    productId,
    type,
    title,
    content,
    createdAt: exportedAt,
    exportedAt,
  };

  return {
    ...snapshot,
    generatedAssets: prependAndLimit(
      [asset, ...snapshot.generatedAssets],
      MAX_GENERATED_ASSETS
    ),
  };
}

export function getLatestAuditRun(
  snapshot: WorkspaceSnapshot,
  storeId: string | null | undefined,
  productId: string
) {
  if (!storeId) {
    return null;
  }

  return (
    snapshot.auditRuns.find(
      (run) => run.storeId === storeId && run.productId === productId
    ) ?? null
  );
}

export function getLatestQueryRun(
  snapshot: WorkspaceSnapshot,
  storeId: string | null | undefined,
  productId: string,
  query?: string
) {
  if (!storeId) {
    return null;
  }

  return (
    snapshot.queryRuns.find(
      (run) =>
        run.storeId === storeId &&
        run.productId === productId &&
        (query ? run.query.toLowerCase() === query.toLowerCase() : true)
    ) ?? null
  );
}

export function getWorkspaceAnalyticsSummary(
  snapshot: WorkspaceSnapshot,
  storeId: string | null | undefined
) {
  const storeEvents = storeId
    ? snapshot.analyticsEvents.filter((event) => event.storeId === storeId)
    : [];

  return {
    counts: {
      login: storeEvents.filter((event) => event.type === "login").length,
      import: storeEvents.filter((event) => event.type === "import").length,
      audit_run: storeEvents.filter((event) => event.type === "audit_run").length,
      query_run: storeEvents.filter((event) => event.type === "query_run").length,
      agent_open: storeEvents.filter((event) => event.type === "agent_open").length,
      asset_export: storeEvents.filter((event) => event.type === "asset_export").length,
    },
    events: storeEvents.slice(0, 8),
  };
}
