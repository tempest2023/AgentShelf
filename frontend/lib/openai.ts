import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { resolveModel } from "@copilotkit/runtime/v2";
import type { LanguageModel } from "ai";

const DEFAULT_OPENAI_MODEL = "openai/gpt-4.1-mini";

export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function getOpenAIBaseUrl(): string | undefined {
  return process.env.OPENAI_BASE_URL?.trim() || undefined;
}

export function resolveGeoModel(): string {
  const configuredModel =
    process.env.COPILOTKIT_OPENAI_MODEL?.trim() ||
    process.env.OPENAI_MODEL?.trim() ||
    DEFAULT_OPENAI_MODEL;

  return configuredModel.includes("/")
    ? configuredModel
    : `openai/${configuredModel}`;
}

export function getGeoModel(): LanguageModel {
  const baseUrl = getOpenAIBaseUrl();
  const apiKey = process.env.OPENAI_API_KEY?.trim() || "";
  const modelSpec = resolveGeoModel();
  const modelId = modelSpec.includes("/")
    ? modelSpec.split("/").slice(1).join("/")
    : modelSpec;

  if (baseUrl) {
    const provider = createOpenAICompatible({
      name: "custom-openai",
      apiKey,
      baseURL: baseUrl,
    });
    return provider(modelId);
  }

  return resolveModel(modelSpec, apiKey);
}
