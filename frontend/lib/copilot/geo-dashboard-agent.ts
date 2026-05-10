import { EventType, type BaseEvent, type RunAgentInput } from "@ag-ui/client";
import { BuiltInAgent } from "@copilotkit/runtime/v2";
import {
  answerGeoAnalyticsQuery,
  extractLatestUserQuery,
  parseGeoAgentRuntimeContext,
} from "@/lib/geo-analytics";

function buildGeoDashboardEvents(input: RunAgentInput): BaseEvent[] {
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
  const assistantMessageId = crypto.randomUUID();
  const toolCallId = crypto.randomUUID();

  return [
    {
      type: EventType.TEXT_MESSAGE_CHUNK,
      messageId: assistantMessageId,
      delta: response.message,
    },
    {
      type: EventType.TOOL_CALL_CHUNK,
      toolCallId,
      toolCallName: "render_geo_chart",
      parentMessageId: assistantMessageId,
      delta: JSON.stringify(response.chart),
    },
  ];
}

export const geoDashboardAgent = new BuiltInAgent({
  type: "custom",
  factory: async ({ input }) => ({
    async *[Symbol.asyncIterator]() {
      for (const event of buildGeoDashboardEvents(input)) {
        yield event;
      }
    },
  }),
});
