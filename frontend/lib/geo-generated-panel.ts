"use client";

import type { GeoChartPayload } from "@/lib/geo-analytics";

export type GeoGeneratedPanelStatus = "generating" | "rendering" | "ready";
export type GeoGeneratedExecutionProvider = "daytona" | "local-fallback";
export type GeoGeneratedExecutionStatus = "ready" | "fallback" | "error";

export interface GeoGeneratedExecutionArtifact {
  provider: GeoGeneratedExecutionProvider;
  status: GeoGeneratedExecutionStatus;
  runtime: "typescript";
  title: string;
  summary: string;
  entryFile: string;
  rawCode: string;
  html: string;
  executedAt: string;
  sandboxId?: string;
  stdout?: string;
  stderr?: string;
  warnings?: string[];
  error?: string;
}

export interface GeoGeneratedPanelToolPayload extends Record<string, unknown> {
  chart: GeoChartPayload;
  execution: GeoGeneratedExecutionArtifact;
}

export interface GeoGeneratedPanelState {
  id: string;
  runId: string;
  productId: string;
  query: string;
  status: GeoGeneratedPanelStatus;
  chart?: GeoChartPayload;
  execution?: GeoGeneratedExecutionArtifact;
  createdAt: number;
  updatedAt: number;
}

export interface GeoGeneratedPanelStartPayload {
  productId: string;
  query: string;
  runId: string;
}

export interface GeoGeneratedPanelRenderingPayload
  extends GeoGeneratedPanelStartPayload {
  chart: GeoChartPayload;
  execution: GeoGeneratedExecutionArtifact;
}

export type GeoGeneratedPanelReadyPayload = GeoGeneratedPanelRenderingPayload;
