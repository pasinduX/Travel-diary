/**
 * Backend auth API client. Server-only.
 *
 * Every function here talks to `${API_URL}/api/v1/auth/*` and returns data in
 * the app's normalised shape (`AuthResult`, `User`, ...). Nothing in here
 * touches cookies or the request context — that is the job of
 * `session.server.ts`.
 */
import {
  ApiError,
  type AuthResult,
  type AuthTokens,
  type GoogleCallbackInput,
  type HealthStatus,
  type LoginInput,
  type RawAuthResponse,
  type RawTokens,
  type RawUser,
  type RegisterInput,
  type User,
} from "@/interface/auth";

import { apiRequest } from "./http.server";

const AUTH_BASE = "/api/v1/auth";

export async function register(input: RegisterInput): Promise<AuthResult> {
  const data = await apiRequest<RawAuthResponse>(`${AUTH_BASE}/register`, {
    method: "POST",
    body: input,
  });
  // Some backends don't return tokens on register — fall back to an explicit login.
  const partial = tryNormalize(data);
  if (partial) return partial;
  return login({ username: input.username, password: input.password });
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const data = await apiRequest<RawAuthResponse>(`${AUTH_BASE}/login`, {
    method: "POST",
    body: input,
  });
  return normalizeAuthResponse(data);
}

/**
 * Exchange a refresh token for a fresh token pair. The backend accepts the
 * token either in the JSON body or as an `X-Refresh-Token` header — we send
 * both to be safe.
 */
export async function refresh(refreshToken: string): Promise<AuthTokens> {
  const data = await apiRequest<RawAuthResponse>(`${AUTH_BASE}/refresh`, {
    method: "POST",
    body: { refreshToken },
    headers: { "X-Refresh-Token": refreshToken },
  });
  const tokens = normalizeTokens(data);
  if (!tokens) {
    throw new ApiError("The refresh response did not contain a new token.", 502, data);
  }
  // Backends often omit the refresh token on refresh when it is unchanged.
  return { ...tokens, refreshToken: tokens.refreshToken || refreshToken };
}

/** Full-page URL the browser should navigate to in order to start Google OAuth. */
export function googleAuthorizeUrl(apiBaseUrl: string): string {
  return `${apiBaseUrl.replace(/\/+$/, "")}${AUTH_BASE}/google`;
}

/**
 * Complete the Google OAuth flow. Used when the backend redirects back to our
 * app with `?code=&state=` instead of handling the callback itself.
 */
export async function googleCallback(input: GoogleCallbackInput): Promise<AuthResult> {
  const data = await apiRequest<RawAuthResponse>(`${AUTH_BASE}/google/callback`, {
    method: "GET",
    query: { code: input.code, state: input.state },
  });
  return normalizeAuthResponse(data);
}

export async function health(): Promise<HealthStatus> {
  try {
    const data = await apiRequest<Record<string, unknown>>("/api/v1/health");
    return { ok: true, detail: JSON.stringify(data) };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, detail: error.message };
    throw error;
  }
}

/* ------------------------------------------------------------------ */
/* Normalisation                                                        */
/* ------------------------------------------------------------------ */

export function normalizeAuthResponse(raw: RawAuthResponse): AuthResult {
  const result = tryNormalize(raw);
  if (!result) {
    throw new ApiError("The sign-in response was missing a user or token.", 502, raw);
  }
  return result;
}

function tryNormalize(raw: RawAuthResponse): AuthResult | null {
  const rawUser = raw.user ?? raw.data?.user;
  const tokens = normalizeTokens(raw);
  if (!rawUser || !tokens) return null;
  return { user: normalizeUser(rawUser), tokens };
}

function normalizeTokens(raw: RawAuthResponse | RawTokens): AuthTokens | null {
  const source: RawTokens = {
    ...raw,
    ...("tokens" in raw && raw.tokens ? raw.tokens : {}),
    ...("data" in raw && raw.data ? raw.data : {}),
  };

  const accessToken = source.accessToken ?? source.access_token ?? source.token ?? null;
  const refreshToken = source.refreshToken ?? source.refresh_token ?? null;
  if (!accessToken || !refreshToken) return null;

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresAt: resolveExpiry(source) ?? jwtExpiry(accessToken),
  };
}

/** Read the `exp` claim from a JWT access token (epoch ms), if present. */
function jwtExpiry(token: string): number | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(
      typeof atob === "function" ? atob(payload) : Buffer.from(payload, "base64").toString("utf8"),
    ) as { exp?: number };
    return typeof json.exp === "number" ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

function resolveExpiry(source: RawTokens): number | null {
  if (source.accessTokenExpiresAt != null) {
    const value =
      typeof source.accessTokenExpiresAt === "number"
        ? source.accessTokenExpiresAt
        : Date.parse(source.accessTokenExpiresAt);
    if (Number.isFinite(value)) {
      // Heuristic: treat 10-digit values as seconds.
      return value < 1e12 ? value * 1000 : value;
    }
  }
  const expiresIn = source.expiresIn ?? source.expires_in;
  if (typeof expiresIn === "number" && expiresIn > 0) {
    return Date.now() + expiresIn * 1000;
  }
  return null;
}

function normalizeUser(raw: RawUser): User {
  const id = raw.id ?? raw._id ?? raw.userId;
  if (id == null) {
    throw new ApiError("The user record from the server had no id.", 502, raw);
  }
  return {
    id: String(id),
    username: raw.username ?? "",
    email: raw.email ?? "",
    name: raw.name ?? raw.fullName ?? raw.displayName ?? raw.username ?? "",
    avatarUrl: raw.avatarUrl ?? raw.avatar ?? raw.picture ?? null,
    provider: raw.provider === "google" ? "google" : "local",
  };
}
