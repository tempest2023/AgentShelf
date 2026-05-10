import { CopilotRuntime } from "@copilotkit/runtime";
import { geoDashboardAgent } from "@/lib/copilot/geo-dashboard-agent";

export const copilotRuntime = new CopilotRuntime({
  agents: {
    geo_dashboard_agent: geoDashboardAgent,
  },
});
