import { EventType, type BaseEvent, type RunAgentInput } from "@ag-ui/client";
import {
  BuiltInAgent,
  convertMessagesToVercelAISDKMessages,
  resolveModel,
} from "@copilotkit/runtime/v2";
import { stepCountIs, streamText, tool } from "ai";
import { z } from "zod";
import {
  answerGeoAnalyticsQuery,
  extractLatestUserQuery,
  parseGeoAgentRuntimeContext,
  type GeoAgentLocale,
  type GeoAnalyticsResponse,
} from "@/lib/geo-analytics";
import { buildGeoGeneratedPanelToolPayload } from "@/lib/daytona-geo-generated-panel";
import type { GeoGeneratedPanelToolPayload } from "@/lib/geo-generated-panel";

const GEO_ANALYTICS_TOOL_NAME = "query_geo_analytics";
const GEO_CHART_TOOL_NAME = "render_geo_chart";
const DEFAULT_OPENAI_MODEL = "openai/gpt-4.1-mini";

async function buildGeoDashboardEvents(
  input: RunAgentInput,
  prefixMessage?: string,
  messageId = crypto.randomUUID()
): Promise<BaseEvent[]> {
  const runtimeContext = parseGeoAgentRuntimeContext(
    input.context as { description: string; value: string }[]
  );
  const fallbackQuery =
    runtimeContext.locale === "zh"
      ? "请展示当前商品的 GEO readiness 图表。"
      : "Show the current product GEO readiness chart.";
  const query = extractLatestUserQuery(
    input.messages as Array<{ role?: string; content?: unknown }>
  );
  const response = answerGeoAnalyticsQuery(query || fallbackQuery, runtimeContext);
  const assistantMessageId = messageId;
  const toolCallId = crypto.randomUUID();
  const message = prefixMessage
    ? `${prefixMessage}\n\n${response.message}`
    : response.message;
  const toolPayload = await buildGeoGeneratedPanelToolPayload({
    chart: response.chart,
    locale: runtimeContext.locale,
    query: query || fallbackQuery,
    selectedProduct: runtimeContext.selectedProduct,
    storeName: runtimeContext.storeName,
  });

  return [
    {
      type: EventType.TEXT_MESSAGE_CHUNK,
      messageId: assistantMessageId,
      delta: message,
    },
    {
      type: EventType.TOOL_CALL_CHUNK,
      toolCallId,
      toolCallName: GEO_CHART_TOOL_NAME,
      parentMessageId: assistantMessageId,
      delta: JSON.stringify(toolPayload),
    },
  ];
}

function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function resolveGeoAgentModel() {
  const configuredModel =
    process.env.COPILOTKIT_OPENAI_MODEL?.trim() ||
    process.env.OPENAI_MODEL?.trim() ||
    DEFAULT_OPENAI_MODEL;

  return configuredModel.includes("/")
    ? configuredModel
    : `openai/${configuredModel}`;
}

function buildOpenAIMissingMessage(locale: GeoAgentLocale) {
  return locale === "zh"
    ? "OpenAI API 尚未配置，当前先使用本地 GEO 查询结果生成图表。配置 `OPENAI_API_KEY` 后，这个 Copilot 会切换到真实 OpenAI 驱动。"
    : "OpenAI API is not configured yet, so I am using the local GEO analytics fallback for this chart. Add `OPENAI_API_KEY` to enable the live OpenAI-backed copilot.";
}

function buildOpenAIErrorMessage(locale: GeoAgentLocale) {
  return locale === "zh"
    ? "这次 OpenAI 响应没有成功返回，我先用本地 GEO 查询结果把图表生成出来，方便你继续演示。"
    : "The OpenAI response did not complete successfully this time, so I generated the chart from the local GEO analytics fallback to keep the demo moving.";
}

function buildContextSummary(input: RunAgentInput) {
  const runtimeContext = parseGeoAgentRuntimeContext(
    input.context as { description: string; value: string }[]
  );

  const lines = [
    `Locale: ${runtimeContext.locale}`,
    runtimeContext.storeName ? `Store: ${runtimeContext.storeName}` : null,
    runtimeContext.storeCategory
      ? `Store category: ${runtimeContext.storeCategory}`
      : null,
    runtimeContext.selectedProduct
      ? `Selected product: ${runtimeContext.selectedProduct.title} (${runtimeContext.selectedProduct.category})`
      : null,
  ].filter(Boolean);

  return {
    runtimeContext,
    contextSummary: lines.join("\n"),
  };
}

function buildGeoAgentSystemPrompt(
  locale: GeoAgentLocale,
  contextSummary: string
) {
  const baseInstructions =
    locale === "zh"
      ? [
          "你是 Dashboard 里的 GEO 数据分析 Copilot。",
          `始终使用${locale === "zh" ? "中文" : "英文"}回答。`,
          "在回答任何 GEO 指标、品类对比或图表请求之前，必须先调用一次 `query_geo_analytics`。",
          "只使用工具返回的数据、洞察和图表信息，绝对不要编造指标、商品或趋势。",
          "回答保持简洁、专业、偏业务决策风格，控制在 2 到 4 句。",
          "优先指出最强项、短板或最值得行动的洞察。",
          "不要输出原始 JSON，也不要要求用户自己再画图，系统会自动渲染图表。",
        ]
      : [
          "You are the GEO analytics copilot inside the dashboard.",
          "Always respond in English.",
          "Before answering any GEO metric, category comparison, or chart request, you must call `query_geo_analytics` exactly once.",
          "Use only the tool output for metrics, insights, and chart context. Never invent numbers, products, or trends.",
          "Keep the answer concise, business-oriented, and limited to 2 to 4 sentences.",
          "Prioritize the strongest signal, the weakest gap, or the most actionable takeaway.",
          "Do not output raw JSON and do not ask the user to visualize the data manually because the dashboard will render the chart automatically.",
        ];

  return `${baseInstructions.join("\n")}\n\n## Current dashboard context\n${contextSummary}`;
}

function buildMessages(input: RunAgentInput, systemPrompt: string) {
  const messages = convertMessagesToVercelAISDKMessages(
    input.messages,
    {
      forwardSystemMessages: true,
      forwardDeveloperMessages: true,
    }
  );

  messages.unshift({
    role: "system",
    content: systemPrompt,
  });

  return messages;
}

function isGeoAnalyticsResponse(value: unknown): value is GeoAnalyticsResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<GeoAnalyticsResponse>;

  return (
    typeof candidate.message === "string" &&
    !!candidate.chart &&
    typeof candidate.chart === "object"
  );
}

function createTextEvent(messageId: string, delta: string): BaseEvent {
  return {
    type: EventType.TEXT_MESSAGE_CHUNK,
    role: "assistant",
    messageId,
    delta,
  };
}

function createChartEvent(
  parentMessageId: string,
  payload: GeoGeneratedPanelToolPayload
): BaseEvent {
  return {
    type: EventType.TOOL_CALL_CHUNK,
    toolCallId: crypto.randomUUID(),
    toolCallName: GEO_CHART_TOOL_NAME,
    parentMessageId,
    delta: JSON.stringify(payload),
  };
}

export const geoDashboardAgent = new BuiltInAgent({
  type: "custom",
  factory: async ({ input, abortSignal }) => ({
    async *[Symbol.asyncIterator]() {
      const assistantMessageId = crypto.randomUUID();
      const { runtimeContext, contextSummary } = buildContextSummary(input);

      if (!hasOpenAIKey()) {
        for (const event of await buildGeoDashboardEvents(
          input,
          buildOpenAIMissingMessage(runtimeContext.locale),
          assistantMessageId
        )) {
          yield event;
        }
        return;
      }

      const fallbackQuery =
        runtimeContext.locale === "zh"
          ? "请展示当前商品的 GEO readiness 图表。"
          : "Show the current product GEO readiness chart.";
      const latestQuery = extractLatestUserQuery(
        input.messages as Array<{ role?: string; content?: unknown }>
      );
      const groundedFallback = answerGeoAnalyticsQuery(
        latestQuery || fallbackQuery,
        runtimeContext
      );
      let emittedText = false;
      let groundedResponse: GeoAnalyticsResponse | undefined;

      try {
        const response = streamText({
          model: resolveModel(resolveGeoAgentModel()),
          messages: buildMessages(
            input,
            buildGeoAgentSystemPrompt(runtimeContext.locale, contextSummary)
          ),
          tools: {
            [GEO_ANALYTICS_TOOL_NAME]: tool({
              description:
                runtimeContext.locale === "zh"
                  ? "查询 GEO 指标、品类对比和图表数据。"
                  : "Query GEO metrics, category comparisons, and chart-ready dashboard data.",
              inputSchema: z.object({
                question: z
                  .string()
                  .min(1)
                  .describe(
                    runtimeContext.locale === "zh"
                      ? "用于 GEO 查询的完整自然语言问题。"
                      : "The full natural-language GEO analytics question to answer."
                  ),
              }),
              execute: async ({ question }) =>
                answerGeoAnalyticsQuery(question, runtimeContext),
            }),
          },
          temperature: 0.2,
          maxOutputTokens: 500,
          stopWhen: stepCountIs(4),
          abortSignal,
          prepareStep: async ({ stepNumber }) => {
            if (stepNumber === 0) {
              return {
                activeTools: [GEO_ANALYTICS_TOOL_NAME],
                toolChoice: {
                  type: "tool",
                  toolName: GEO_ANALYTICS_TOOL_NAME,
                },
              };
            }

            return {
              activeTools: [],
              toolChoice: "none",
            };
          },
        });

        for await (const part of response.fullStream) {
          if (part.type === "text-delta" && part.text) {
            emittedText = true;
            yield createTextEvent(assistantMessageId, part.text);
            continue;
          }

          if (part.type === "tool-result") {
            const toolName = "toolName" in part ? part.toolName : "";
            const partRecord = part as Record<string, unknown>;
            const toolOutput = partRecord.output ?? partRecord.result;

            if (
              toolName === GEO_ANALYTICS_TOOL_NAME &&
              isGeoAnalyticsResponse(toolOutput)
            ) {
              groundedResponse = toolOutput;
            }
          }
        }

        const finalGroundedResponse = groundedResponse ?? groundedFallback;
        const toolPayload = await buildGeoGeneratedPanelToolPayload({
          chart: finalGroundedResponse.chart,
          locale: runtimeContext.locale,
          query: latestQuery || fallbackQuery,
          selectedProduct: runtimeContext.selectedProduct,
          storeName: runtimeContext.storeName,
        });

        if (!emittedText) {
          yield createTextEvent(assistantMessageId, finalGroundedResponse.message);
        }

        yield createChartEvent(assistantMessageId, toolPayload);
      } catch {
        if (abortSignal.aborted) {
          return;
        }

        const fallbackMessage = emittedText
          ? `\n\n${buildOpenAIErrorMessage(runtimeContext.locale)}`
          : buildOpenAIErrorMessage(runtimeContext.locale);

        yield createTextEvent(assistantMessageId, fallbackMessage);

        if (!emittedText) {
          yield createTextEvent(
            assistantMessageId,
            `\n\n${groundedFallback.message}`
          );
        }

        const toolPayload = await buildGeoGeneratedPanelToolPayload({
          chart: groundedFallback.chart,
          locale: runtimeContext.locale,
          query: latestQuery || fallbackQuery,
          selectedProduct: runtimeContext.selectedProduct,
          storeName: runtimeContext.storeName,
        });

        yield createChartEvent(assistantMessageId, toolPayload);
      }
    },
  }),
});
