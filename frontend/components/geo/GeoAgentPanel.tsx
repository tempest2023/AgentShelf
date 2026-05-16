"use client";

import {
  useCallback,
  useEffect,
  isValidElement,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotChatView,
  useAgent,
  useAgentContext,
  useFrontendTool,
  type ReactFrontendTool,
} from "@copilotkit/react-core/v2";
import type { Message } from "@ag-ui/core";
import { z } from "zod";
import type { Category, Product } from "@/lib/types";
import type { GeoChartPayload } from "@/lib/geo-analytics";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import type {
  GeoGeneratedPanelReadyPayload,
  GeoGeneratedPanelRenderingPayload,
  GeoGeneratedPanelStartPayload,
} from "@/lib/geo-generated-panel";

const geoChartSchema = z.object({
  title: z.string(),
  description: z.string(),
  insight: z.string(),
  metricLabel: z.string(),
  unit: z.enum(["score", "percent", "currency", "visits", "count"]),
  primarySeriesLabel: z.string(),
  secondarySeriesLabel: z.string().optional(),
  higherIsBetter: z.boolean(),
  initialSort: z.enum(["asc", "desc"]),
  data: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      primaryValue: z.number(),
      secondaryValue: z.number().optional(),
      note: z.string().optional(),
      highlighted: z.boolean().optional(),
    })
  ),
});

const GEO_AGENT_ID = "geo_dashboard_agent";
const DASHBOARD_RENDER_DELAY_MS = 1450;

const GEO_PLACEHOLDER_QUESTIONS: Record<
  "en" | "zh",
  Record<Category, string>
> = {
  en: {
    electronics:
      'For TechNova, what GEO signal is missing for "wireless earbuds for commuting"?',
    outdoor:
      'For Summit Trail, how does this SKU compare on "waterproof hiking backpack"?',
    pets:
      'For Paws & Whiskers, what schema or FAQ signal is missing for "interactive cat toys"?',
    health:
      'For VitalLife, how much GEO traffic uplift could "omega 3 supplement benefits" unlock?',
  },
  zh: {
    electronics: '锐科电子在“通勤降噪耳机”下还缺哪项 GEO 信号？',
    outdoor: '峰行户外这款商品在“防水徒步背包”下表现如何？',
    pets: '萌宠天地在“室内猫互动玩具”下缺少哪项 schema 或 FAQ？',
    health: '维他生活在“omega 3 补剂功效”下还能提升多少 GEO 流量？',
  },
};

const GEO_STARTER_CATEGORY_LABELS: Record<
  "en" | "zh",
  Record<Category, string>
> = {
  en: {
    electronics: "Electronics",
    outdoor: "Outdoor & Sports",
    pets: "Pet Supplies",
    health: "Health & Supplements",
  },
  zh: {
    electronics: "电子产品",
    outdoor: "户外运动",
    pets: "宠物用品",
    health: "保健品",
  },
};

type GeoAgentWelcomeScreenProps = ComponentProps<
  typeof CopilotChatView.WelcomeScreen
>;
type SubmitMessageHandler = (value: string) => void;

function findSubmitMessageHandler(
  node: ReactNode
): SubmitMessageHandler | null {
  if (Array.isArray(node)) {
    for (const child of node) {
      const handler = findSubmitMessageHandler(child);
      if (handler) return handler;
    }

    return null;
  }

  if (!isValidElement(node)) {
    return null;
  }

  const props = node.props as {
    children?: ReactNode;
    onSubmitMessage?: unknown;
  };

  if (typeof props.onSubmitMessage === "function") {
    return props.onSubmitMessage as SubmitMessageHandler;
  }

  return findSubmitMessageHandler(props.children);
}

export default function GeoAgentPanel({
  selectedProduct,
  onGeneratedPanelStart,
  onGeneratedPanelRendering,
  onGeneratedPanelReady,
}: {
  selectedProduct: Product;
  onGeneratedPanelStart: (payload: GeoGeneratedPanelStartPayload) => void;
  onGeneratedPanelRendering: (
    payload: GeoGeneratedPanelRenderingPayload
  ) => void;
  onGeneratedPanelReady: (payload: GeoGeneratedPanelReadyPayload) => void;
}) {
  const { agent } = useAgent({ agentId: GEO_AGENT_ID });
  const { user } = useAuth();
  const { locale } = useLanguage();
  const [dashboardSyncPhases, setDashboardSyncPhases] = useState<
    Record<string, "rendering" | "ready">
  >({});
  const [optimisticUserMessage, setOptimisticUserMessage] =
    useState<Message | null>(null);
  const [persistedMessages, setPersistedMessages] = useState<Message[]>([]);
  const pendingPromptRef = useRef("");
  const activeRunIdRef = useRef<string | null>(null);
  const scheduledRunIdsRef = useRef<Set<string>>(new Set());
  const syncTimersRef = useRef<Map<string, number>>(new Map());

  useAgentContext({
    description: "ui_locale",
    value: locale,
  });

  useAgentContext({
    description: "selected_product",
    value: {
      id: selectedProduct.id,
      title: selectedProduct.title,
      category: selectedProduct.category,
      brand: selectedProduct.brand,
      price: selectedProduct.price,
    },
  });

  useAgentContext({
    description: "store_context",
    value: {
      storeName: (locale === "zh" ? user?.storeNameZh : user?.storeName) ?? null,
      category: user?.category ?? null,
    },
  });

  const activeCategory = user?.category ?? selectedProduct.category;

  const suggestions = useMemo(
    () => {
      const categoryLabel =
        locale === "zh"
          ? GEO_STARTER_CATEGORY_LABELS.zh[activeCategory]
          : GEO_STARTER_CATEGORY_LABELS.en[activeCategory];

      return locale === "zh"
        ? [
            {
              message: "当前商品最弱的 GEO 维度是什么？",
            },
            {
              message: `${categoryLabel}类目里，哪些商品的可发现性最高？`,
            },
            {
              message: `${categoryLabel}类目在 GEO 优化后还有多少流量提升空间？`,
            },
          ]
        : [
            {
              message:
                "Which GEO dimension is weakest for the current product?",
            },
            {
              message: `Within ${categoryLabel}, which products lead on discoverability?`,
            },
            {
              message: `How much traffic uplift is available in ${categoryLabel} after GEO optimization?`,
            },
          ];
    },
    [activeCategory, locale]
  );

  const chatInputPlaceholder = useMemo(() => {
    return locale === "zh"
      ? GEO_PLACEHOLDER_QUESTIONS.zh[activeCategory]
      : GEO_PLACEHOLDER_QUESTIONS.en[activeCategory];
  }, [activeCategory, locale]);
  const liveMessagesKey = agent.messages
    .map((message) => {
      const contentKey =
        typeof message.content === "string"
          ? message.content.length
          : Array.isArray(message.content)
            ? message.content.length
            : 0;
      const toolCallsKey =
        "toolCalls" in message && Array.isArray(message.toolCalls)
          ? message.toolCalls
              .map(
                (toolCall) =>
                  `${toolCall.id}:${toolCall.function?.arguments?.length ?? 0}`
              )
              .join(";")
          : "";

      return `${message.id}:${message.role}:${contentKey}:${toolCallsKey}`;
    })
    .join(",");
  const liveMessages = useMemo(
    () => [...agent.messages] as Message[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [liveMessagesKey, agent.messages]
  );
  const displayMessages = useMemo(() => {
    if (liveMessages.length > 0) {
      return liveMessages;
    }

    if (persistedMessages.length > 0) {
      return persistedMessages;
    }

    return optimisticUserMessage ? [optimisticUserMessage] : [];
  }, [liveMessages, optimisticUserMessage, persistedMessages]);

  useEffect(() => {
    pendingPromptRef.current = chatInputPlaceholder;
    activeRunIdRef.current = null;
  }, [chatInputPlaceholder, selectedProduct.id]);

  useEffect(() => {
    if (liveMessages.length === 0) {
      return;
    }

    queueMicrotask(() => {
      setPersistedMessages((current) =>
        current === liveMessages ? current : liveMessages
      );

      if (optimisticUserMessage) {
        setOptimisticUserMessage(null);
      }
    });
  }, [liveMessages, optimisticUserMessage]);

  useEffect(() => {
    const timers = syncTimersRef.current;

    return () => {
      for (const timer of timers.values()) {
        window.clearTimeout(timer);
      }
      timers.clear();
    };
  }, []);

  const beginDashboardGeneration = useCallback(
    (message: string) => {
      const runId = crypto.randomUUID();
      pendingPromptRef.current = message;
      activeRunIdRef.current = runId;
      onGeneratedPanelStart({
        productId: selectedProduct.id,
        query: message,
        runId,
      });
    },
    [onGeneratedPanelStart, selectedProduct.id]
  );

  const requestDashboardSync = useCallback(
    (payload: GeoGeneratedPanelRenderingPayload) => {
      const { runId } = payload;

      setDashboardSyncPhases((current) =>
        current[runId]
          ? current
          : {
              ...current,
              [runId]: "rendering",
            }
      );

      if (scheduledRunIdsRef.current.has(runId)) {
        return;
      }

      scheduledRunIdsRef.current.add(runId);
      onGeneratedPanelRendering(payload);

      const timer = window.setTimeout(() => {
        setDashboardSyncPhases((current) =>
          current[runId] === "ready"
            ? current
            : {
                ...current,
                [runId]: "ready",
              }
        );
        onGeneratedPanelReady(payload);
        syncTimersRef.current.delete(runId);
      }, DASHBOARD_RENDER_DELAY_MS);

      syncTimersRef.current.set(runId, timer);
    },
    [onGeneratedPanelReady, onGeneratedPanelRendering]
  );

  const welcomeScreen = useMemo(() => {
    function GeoAgentWelcomeScreen({
      input,
      className,
    }: GeoAgentWelcomeScreenProps) {
      const submitStarterPrompt = findSubmitMessageHandler(input);

      return (
        <div className={`geo-agent-welcome-screen${className ? ` ${className}` : ""}`}>
          <div className="geo-agent-welcome-stack">
            <div
              className="geo-agent-starter-pills"
              aria-label={locale === "zh" ? "示例问题" : "Starter prompts"}
            >
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.message}
                  type="button"
                  disabled={agent.isRunning || !submitStarterPrompt}
                  onClick={() => submitStarterPrompt?.(suggestion.message)}
                  aria-label={suggestion.message}
                  className="geo-agent-starter-pill"
                >
                  <span className="geo-agent-starter-pill-question">
                    {suggestion.message}
                  </span>
                </button>
              ))}
            </div>
            <div className="geo-agent-welcome-input">{input}</div>
          </div>
        </div>
      );
    }

    return GeoAgentWelcomeScreen;
  }, [agent.isRunning, locale, suggestions]);

  const chatView = useMemo(() => {
    function GeoAgentChatView(props: ComponentProps<typeof CopilotChatView>) {
      const handleSubmitMessage = (value: string) => {
        beginDashboardGeneration(value);
        setOptimisticUserMessage({
          id: crypto.randomUUID(),
          role: "user",
          content: value,
        });
        props.onSubmitMessage?.(value);
      };

      return (
        <CopilotChatView
          {...props}
          messages={displayMessages}
          onSubmitMessage={handleSubmitMessage}
          welcomeScreen={displayMessages.length > 0 ? false : welcomeScreen}
          input={{
            className: "geo-agent-chat-input-shell",
            textArea: "geo-agent-chat-textarea",
            disclaimer: "geo-agent-chat-disclaimer",
            sendButton: "geo-agent-chat-send",
            addMenuButton: "geo-agent-chat-add",
          }}
          messageView={{
            className: "geo-agent-message-view",
            assistantMessage: {
              className: "geo-agent-assistant-message",
              toolbar: "geo-agent-assistant-toolbar",
            },
            userMessage: {
              className: "geo-agent-user-message",
              messageRenderer: "geo-agent-user-bubble",
              toolbar: "geo-agent-user-toolbar",
            },
          }}
        />
      );
    }

    return GeoAgentChatView;
  }, [beginDashboardGeneration, displayMessages, welcomeScreen]);

  const geoChartTool: ReactFrontendTool<GeoChartPayload> = {
    agentId: GEO_AGENT_ID,
    name: "render_geo_chart",
    description: "Render an interactive GEO analytics chart inside the chat.",
    parameters: geoChartSchema,
    followUp: false,
    render: ({ args }) => {
      const parsed = geoChartSchema.safeParse(args);

      if (!parsed.success) {
        return (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
            {locale === "zh" ? "正在整理图表…" : "Preparing chart..."}
          </div>
        );
      }

      const currentRunId = activeRunIdRef.current ?? crypto.randomUUID();

      return (
        <GeoGeneratedToolNotice
          chart={parsed.data}
          locale={locale}
          productId={selectedProduct.id}
          query={pendingPromptRef.current || chatInputPlaceholder}
          runId={currentRunId}
          phase={dashboardSyncPhases[currentRunId] ?? "rendering"}
          onSyncRequested={requestDashboardSync}
        />
      );
    },
  };

  useFrontendTool(geoChartTool, [
    chatInputPlaceholder,
    dashboardSyncPhases,
    locale,
    requestDashboardSync,
    selectedProduct.id,
  ]);

  return (
    <CopilotChatConfigurationProvider agentId={GEO_AGENT_ID}>
      <div className="geo-agent-panel flex h-full min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-contain">
        <div className="geo-agent-compact-header border-b border-zinc-200/70 px-4 py-3 dark:border-zinc-800/80">
          <div className="geo-agent-context-bar">
            <span className="geo-agent-context-label">
              {locale === "zh" ? "当前商品" : "Current product"}
            </span>
            <span className="geo-agent-context-value">{selectedProduct.title}</span>
          </div>
        </div>
        <div data-sidebar-chat className="geo-agent-chat-shell flex min-h-0 w-full flex-1 flex-col">
          <CopilotChat
            agentId={GEO_AGENT_ID}
            chatView={chatView}
            labels={{
              chatInputPlaceholder,
              chatDisclaimerText:
                locale === "zh"
                  ? "AI 可能出错，请核对重要信息。"
                  : "AI can make mistakes. Please verify important information.",
            }}
            className="geo-agent-chat flex h-full min-h-0 flex-1 bg-transparent"
          />
        </div>
      </div>
    </CopilotChatConfigurationProvider>
  );
}

function GeoGeneratedToolNotice({
  chart,
  locale,
  productId,
  query,
  runId,
  phase,
  onSyncRequested,
}: {
  chart: GeoChartPayload;
  locale: "en" | "zh";
  productId: string;
  query: string;
  runId: string;
  phase: "rendering" | "ready";
  onSyncRequested: (payload: GeoGeneratedPanelRenderingPayload) => void;
}) {
  useEffect(() => {
    onSyncRequested({ productId, query, runId, chart });
  }, [chart, onSyncRequested, productId, query, runId]);

  const steps =
    locale === "zh"
      ? [
          {
            label: "图表数据已生成",
            status: "done" as const,
          },
          {
            label: "正在重新渲染 GEO Readiness Dashboard",
            status: phase === "rendering" ? ("active" as const) : ("done" as const),
          },
          {
            label: "完成后发送更新确认",
            status: phase === "ready" ? ("done" as const) : ("pending" as const),
          },
        ]
      : [
          {
            label: "Chart data generated",
            status: "done" as const,
          },
          {
            label: "Re-rendering the GEO Readiness Dashboard",
            status: phase === "rendering" ? ("active" as const) : ("done" as const),
          },
          {
            label: "Sending update confirmation",
            status: phase === "ready" ? ("done" as const) : ("pending" as const),
          },
        ];

  return (
    <div className="rounded-[22px] border border-sky-200/80 bg-[linear-gradient(180deg,rgba(240,249,255,0.98),rgba(236,253,245,0.94))] px-4 py-4 text-sm text-slate-800 dark:border-sky-500/20 dark:bg-[linear-gradient(180deg,rgba(12,18,28,0.96),rgba(6,95,70,0.16))] dark:text-sky-100">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
        {phase === "rendering"
          ? locale === "zh"
            ? "正在同步 Dashboard"
            : "Syncing dashboard"
          : locale === "zh"
            ? "Dashboard 已更新"
            : "Dashboard updated"}
      </div>
      <div className="mt-3 flex items-start gap-3">
        <div className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-sky-200/80 bg-white/90 dark:border-sky-400/20 dark:bg-zinc-950/70">
          <div className="geo-dashboard-orbit absolute inset-1 rounded-[14px] border border-sky-300/80 motion-reduce:animate-none dark:border-sky-400/30" />
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              phase === "rendering" ? "bg-sky-500" : "bg-emerald-500"
            }`}
          />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-slate-900 dark:text-white">
            {phase === "rendering"
              ? locale === "zh"
                ? "正在播放生成后的重新渲染流程，让主界面可见地完成更新。"
                : "Running a visible re-render pass so the dashboard update feels progressive."
              : locale === "zh"
                ? "GEO Readiness Dashboard 已更新。"
                : "The GEO Readiness Dashboard has been updated."}
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-sky-50/78">
            {chart.title}
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-full bg-sky-100/90 dark:bg-sky-400/10">
        <div
          className={`geo-dashboard-scan h-2 rounded-full bg-[linear-gradient(90deg,rgba(14,165,233,0.82),rgba(45,212,191,0.96),rgba(52,211,153,0.86))] transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none motion-reduce:transition-none ${
            phase === "ready" ? "" : "opacity-90"
          }`}
          style={{ width: phase === "ready" ? "100%" : "76%" }}
        />
      </div>

      <div className="mt-4 space-y-2">
        {steps.map((step) => (
          <div
            key={step.label}
            className={`rounded-[18px] border px-3 py-2.5 ${
              step.status === "done"
                ? "border-emerald-200/80 bg-white/82 dark:border-emerald-400/20 dark:bg-zinc-950/60"
                : step.status === "active"
                  ? "border-sky-200/80 bg-white/88 dark:border-sky-400/20 dark:bg-zinc-950/70"
                  : "border-zinc-200/80 bg-white/70 dark:border-zinc-800 dark:bg-zinc-950/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  step.status === "done"
                    ? "bg-emerald-500"
                    : step.status === "active"
                      ? "bg-sky-500 motion-safe:animate-pulse motion-reduce:animate-none"
                      : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              />
              <span
                className={`text-xs leading-5 ${
                  step.status === "pending"
                    ? "text-zinc-500 dark:text-zinc-400"
                    : "text-slate-700 dark:text-zinc-200"
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
