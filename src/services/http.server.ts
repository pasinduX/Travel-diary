import { ApiError } from "@/interface/auth";

import { getAuthEnv } from "./env.server";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /**
   * Request body. A `FormData` is sent as multipart (the browser/undici sets
   * the boundary); anything else is JSON-serialised.
   */
  body?: unknown;
  /** Bearer token for authenticated calls. */
  token?: string;
  headers?: Record<string, string>;
  query?: Record<string, string | undefined>;
  signal?: AbortSignal;
  /** Override the default request timeout (ms). Uploads need longer. */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 15_000;

/**
 * Thin fetch wrapper around the backend API. Server-only.
 *
 * - Prefixes the configured API base URL.
 * - Serialises JSON bodies (passes `FormData` through untouched).
 * - Parses JSON responses.
 * - Normalises every failure (transport, timeout, non-2xx, bad JSON) into `ApiError`.
 */
export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { apiBaseUrl } = getAuthEnv();

  const url = new URL(`${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, value);
  }

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const hasBody = options.body !== undefined;

  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  if (options.signal) {
    options.signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      headers: {
        Accept: "application/json",
        // Let fetch set multipart Content-Type (with boundary) for FormData.
        ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...options.headers,
      },
      body: isFormData
        ? (options.body as FormData)
        : hasBody
          ? JSON.stringify(options.body)
          : undefined,
      signal: controller.signal,
      credentials: "omit",
    });
  } catch (cause) {
    if (timedOut) {
      throw new ApiError("The request timed out. Please try again.", 0, undefined, { cause });
    }
    // Surface the underlying reason (ECONNREFUSED, ENOTFOUND, ...) and the
    // host we tried — this is almost always a misconfigured API URL or a
    // backend that isn't running.
    const reason =
      (cause as { cause?: { code?: string } })?.cause?.code ??
      (cause instanceof Error ? cause.message : "unknown error");
    throw new ApiError(`Could not reach the API at ${url.origin} (${reason}).`, 0, undefined, {
      cause,
    });
  } finally {
    clearTimeout(timeout);
  }

  const raw = await response.text();
  const data = raw ? safeJsonParse(raw) : undefined;

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(data) ?? defaultMessageForStatus(response.status),
      response.status,
      data,
    );
  }

  return data as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function extractErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const candidate = record.message ?? record.error ?? record.detail ?? record.msg ?? record.title;

  if (typeof candidate === "string" && candidate.trim()) return candidate.trim();

  // Some APIs return { errors: [{ message }] } or { errors: { field: [msg] } }.
  if (Array.isArray(record.errors) && record.errors.length > 0) {
    const first = record.errors[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && "message" in first) {
      return String((first as Record<string, unknown>).message);
    }
  }
  return null;
}

function defaultMessageForStatus(status: number): string {
  switch (status) {
    case 400:
      return "Some of the details you entered aren't valid.";
    case 401:
      return "Your session has expired. Please sign in again.";
    case 403:
      return "You don't have access to do that.";
    case 404:
      return "That resource could not be found.";
    case 409:
      return "That conflicts with something that already exists.";
    case 413:
      return "Those files are too large.";
    case 429:
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return status >= 500
        ? "The server is having problems. Please try again shortly."
        : `Request failed (${status}).`;
  }
}
