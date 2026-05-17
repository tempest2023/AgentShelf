import { createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";
import type { NextRequest } from "next/server";
import { copilotRuntime } from "@/lib/copilot/runtime";

export const runtime = "nodejs";

const handleRequest = createCopilotRuntimeHandler({
  runtime: copilotRuntime.instance,
  basePath: "/api/copilotkit",
});

export const GET = async (request: NextRequest) => {
  return handleRequest(request);
};

export const POST = async (request: NextRequest) => {
  return handleRequest(request);
};

export const PATCH = async (request: NextRequest) => {
  return handleRequest(request);
};

export const DELETE = async (request: NextRequest) => {
  return handleRequest(request);
};

export const OPTIONS = async (request: NextRequest) => {
  return handleRequest(request);
};
