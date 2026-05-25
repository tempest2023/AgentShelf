import type { Product, ProductAudit, QuerySimulation } from "@/lib/types";

export type WorkspaceAIStatusMode = "live" | "fallback" | "unavailable";
export type WorkspaceAnalyticsEventType =
  | "login"
  | "import"
  | "audit_run"
  | "query_run"
  | "agent_open"
  | "asset_export";
export type WorkspaceGeneratedAssetType =
  | "jsonld"
  | "faq"
  | "feed_patch"
  | "intent_pack";
export type WorkspaceImportSource =
  | "shopify"
  | "stripe"
  | "tiktok"
  | "amazon"
  | "csv-upload";

export interface WorkspaceStoreRecord {
  id: string;
  userId: string;
  name: string;
  nameZh: string;
  category: Product["category"];
  lastImportAt?: string;
  lastImportSource?: WorkspaceImportSource;
}

export interface WorkspaceProductRecord extends Product {
  storeId: string;
  importedAt: string;
  importSource: WorkspaceImportSource;
}

export interface WorkspaceAnalyticsEventRecord {
  id: string;
  storeId: string;
  type: WorkspaceAnalyticsEventType;
  createdAt: string;
  metadata: Record<string, string | number | boolean | null>;
}

export interface WorkspaceAuditRunRecord {
  id: string;
  storeId: string;
  productId: string;
  createdAt: string;
  statusMode: WorkspaceAIStatusMode;
  statusMessage: string;
  model: string;
  error?: string;
  audit: ProductAudit;
}

export interface WorkspaceQueryRunRecord {
  id: string;
  storeId: string;
  productId: string;
  query: string;
  createdAt: string;
  statusMode: WorkspaceAIStatusMode;
  statusMessage: string;
  model: string;
  error?: string;
  simulation: QuerySimulation;
}

export interface WorkspaceGeneratedAssetRecord {
  id: string;
  storeId: string;
  productId: string;
  type: WorkspaceGeneratedAssetType;
  title: string;
  content: string;
  createdAt: string;
  exportedAt: string;
}

export interface WorkspaceSnapshot {
  version: 1;
  stores: WorkspaceStoreRecord[];
  products: WorkspaceProductRecord[];
  auditRuns: WorkspaceAuditRunRecord[];
  queryRuns: WorkspaceQueryRunRecord[];
  generatedAssets: WorkspaceGeneratedAssetRecord[];
  analyticsEvents: WorkspaceAnalyticsEventRecord[];
}

export interface WorkspaceCatalogPreviewRow {
  rowNumber: number;
  title: string;
  brand: string;
  priceText: string;
  category: string;
  errors: string[];
  warnings: string[];
}

export interface WorkspaceImportPreview {
  headers: string[];
  recognizedColumns: string[];
  ignoredColumns: string[];
  rows: WorkspaceCatalogPreviewRow[];
  products: Product[];
}
