import { ApiError } from "@/interface/auth";
import { getBrowserAccessToken } from "@/lib/auth/access-token";

export async function browserApiRequest<T = unknown>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
  } = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const hasBody = options.body !== undefined;
  const isPublicPricing = path === "/api/v1/pricing";
  const directApiUrl = import.meta.env.DEV ? (import.meta.env.VITE_API_URL ?? "") : "";
  const requestUrl = directApiUrl ? `${directApiUrl.replace(/\/$/, "")}${path}` : path;
  const accessToken = !isPublicPricing && directApiUrl ? await getBrowserAccessToken() : null;

  const response = await fetch(requestUrl, {
    method: options.method ?? "GET",
    credentials: directApiUrl ? "omit" : "same-origin",
    headers: {
      Accept: "application/json",
      ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: isFormData
      ? (options.body as FormData)
      : hasBody
        ? JSON.stringify(options.body)
        : undefined,
  });

  const raw = await response.text();
  let data: unknown;
  try {
    data = raw ? JSON.parse(raw) : undefined;
  } catch {
    data = raw;
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : `Request failed (${response.status}).`;
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
