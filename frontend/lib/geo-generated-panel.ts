"use client";

import type { GeoChartPayload } from "@/lib/geo-analytics";

export type GeoGeneratedPanelStatus = "generating" | "ready";

export interface GeoGeneratedPanelState {
  id: string;
  runId: string;
  productId: string;
  query: string;
  status: GeoGeneratedPanelStatus;
  chart?: GeoChartPayload;
  createdAt: number;
  updatedAt: number;
}

export interface GeoGeneratedPanelStartPayload {
  productId: string;
  query: string;
  runId: string;
}

export interface GeoGeneratedPanelReadyPayload
  extends GeoGeneratedPanelStartPayload {
  chart: GeoChartPayload;
}
