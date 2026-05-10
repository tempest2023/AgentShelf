import { createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";
import type { NextRequest } from "next/server";
import { copilotRuntime } from "@/lib/copilot/runtime";

const handleRequest = createCopilotRuntimeHandler({
  runtime: copilotRuntime.instance,
  basePath: "/api/copilotkit",
  mode: "single-route",
});

export const POST = async (request: NextRequest) => {
  return handleRequest(request);
};
