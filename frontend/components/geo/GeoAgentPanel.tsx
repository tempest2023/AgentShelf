"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import {
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotChatView,
  useAgent,
  useAgentContext,
  useCopilotKit,
  useFrontendTool,
  type ReactFrontendTool,
} from "@copilotkit/react-core/v2";
import { z } from "zod";
import type { Category, Product } from "@/lib/types";
import type { GeoChartPayload } from "@/lib/geo-analytics";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import type {
  GeoGeneratedPanelReadyPayload,
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

export default function GeoAgentPanel({
  selectedProduct,
  onGeneratedPanelStart,
  onGeneratedPanelReady,
}: {
  selectedProduct: Product;
  onGeneratedPanelStart: (payload: GeoGeneratedPanelStartPayload) => void;
  onGeneratedPanelReady: (payload: GeoGeneratedPanelReadyPayload) => void;
}) {
  const { agent } = useAgent({ agentId: GEO_AGENT_ID });
  const { copilotkit } = useCopilotKit();
  const { user } = useAuth();
  const { locale } = useLanguage();
  const [isSubmittingStarter, setIsSubmittingStarter] = useState(false);
  const pendingPromptRef = useRef("");
  const activeRunIdRef = useRef<string | null>(null);

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

  useEffect(() => {
    pendingPromptRef.current = chatInputPlaceholder;
    activeRunIdRef.current = null;
  }, [chatInputPlaceholder, selectedProduct.id]);

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

  const handleGeneratedChart = useCallback(
    (chart: GeoChartPayload) => {
      onGeneratedPanelReady({
        productId: selectedProduct.id,
        query: pendingPromptRef.current || chatInputPlaceholder,
        runId: activeRunIdRef.current ?? crypto.randomUUID(),
        chart,
      });
    },
    [chatInputPlaceholder, onGeneratedPanelReady, selectedProduct.id]
  );

  const handleStarterPrompt = useCallback(
    async (message: string) => {
      if (isSubmittingStarter) return;

      beginDashboardGeneration(message);
      setIsSubmittingStarter(true);
      agent.addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: message,
      });

      try {
        await copilotkit.runAgent({ agent });
      } finally {
        setIsSubmittingStarter(false);
      }
    },
    [agent, beginDashboardGeneration, copilotkit, isSubmittingStarter]
  );

  const welcomeScreen = useMemo(() => {
    function GeoAgentWelcomeScreen({
      input,
      className,
    }: GeoAgentWelcomeScreenProps) {
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
                  disabled={isSubmittingStarter}
                  onClick={() => handleStarterPrompt(suggestion.message)}
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
  }, [handleStarterPrompt, isSubmittingStarter, locale, suggestions]);

  const chatView = useMemo(() => {
    function GeoAgentChatView(props: ComponentProps<typeof CopilotChatView>) {
      const handleSubmitMessage = (value: string) => {
        beginDashboardGeneration(value);
        props.onSubmitMessage?.(value);
      };

      return (
        <CopilotChatView
          {...props}
          onSubmitMessage={handleSubmitMessage}
          welcomeScreen={welcomeScreen}
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

    return Object.assign(GeoAgentChatView, CopilotChatView);
  }, [beginDashboardGeneration, welcomeScreen]);

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

      return (
        <GeoGeneratedToolNotice
          chart={parsed.data}
          locale={locale}
          onGeneratedChart={handleGeneratedChart}
        />
      );
    },
  };

  useFrontendTool(geoChartTool, [handleGeneratedChart, locale]);

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
  onGeneratedChart,
}: {
  chart: GeoChartPayload;
  locale: "en" | "zh";
  onGeneratedChart: (chart: GeoChartPayload) => void;
}) {
  const signature = useMemo(() => JSON.stringify(chart), [chart]);
  const reportedSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (reportedSignatureRef.current === signature) return;
    reportedSignatureRef.current = signature;
    onGeneratedChart(chart);
  }, [chart, onGeneratedChart, signature]);

  return (
    <div className="rounded-[22px] border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
        {locale === "zh" ? "已插入 Dashboard" : "Inserted into dashboard"}
      </div>
      <div className="mt-1 font-medium">
        {chart.title}
      </div>
      <p className="mt-1 text-xs leading-5 text-emerald-700/80 dark:text-emerald-300/80">
        {locale === "zh"
          ? "主 Dashboard 中已经生成了一个可关闭的 GEO 结果 panel。"
          : "A dismissible GEO result panel has been generated in the main dashboard."}
      </p>
    </div>
  );
}
