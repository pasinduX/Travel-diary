import { createFileRoute } from "@tanstack/react-router";

import { requireAccessToken } from "@/services/session.server";
import { getAuthEnv } from "@/services/env.server";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

async function proxyRequest({ request, params }: { request: Request; params: { _splat: string } }) {
  try {
    const path = `/api/v1/${params._splat ?? ""}`;
    const isPublicPricing = path === "/api/v1/pricing";
    const { apiBaseUrl } = getAuthEnv();
    const target = new URL(path, `${apiBaseUrl}/`);
    target.search = new URL(request.url).search;

    const headers = new Headers();
    const contentType = request.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);
    const accept = request.headers.get("accept");
    if (accept) headers.set("accept", accept);

    if (!isPublicPricing) {
      headers.set("authorization", `Bearer ${await requireAccessToken()}`);
    }

    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const response = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
    });

    const responseHeaders = new Headers();
    const responseType = response.headers.get("content-type");
    if (responseType) responseHeaders.set("content-type", responseType);

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const status =
      typeof error === "object" && error && "status" in error
        ? Number((error as { status: unknown }).status)
        : 500;
    const message = error instanceof Error ? error.message : "API proxy request failed.";
    return Response.json({ message }, { status: status > 0 ? status : 500 });
  }
}

export const Route = createFileRoute("/api/v1/$")({
  server: {
    handlers: Object.fromEntries(METHODS.map((method) => [method, proxyRequest])) as Record<
      (typeof METHODS)[number],
      typeof proxyRequest
    >,
  },
});
