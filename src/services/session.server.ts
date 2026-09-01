/**
 * Session management. Server-only.
 *
 * The backend hands us an access token + refresh token in its JSON responses.
 * We never expose those to the browser. Instead they are stored — together
 * with the user record — inside an AES-encrypted, signed, httpOnly cookie
 * ("sealed session") managed by TanStack Start's `useSession`.
 *
 * The browser only ever sees the opaque sealed blob; JS on the page cannot
 * read it (httpOnly), and it cannot be tampered with (signed).
 */
import { useSession } from "@tanstack/react-start/server";

import {
  ApiError,
  type AuthResult,
  type AuthTokens,
  type SessionPayload,
  type User,
} from "@/interface/auth";

import * as authService from "./auth.service";
import { getAuthEnv } from "./env.server";

const SESSION_NAME = "voyaloom_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
/** Refresh the access token if it expires within this window. */
const REFRESH_SKEW_MS = 60_000;

function authSession() {
  const { sessionSecret, isProduction } = getAuthEnv();
  // `useSession` is TanStack Start's server-side request helper, not a React
  // hook — the naming just collides with the rules-of-hooks lint.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSession<SessionPayload>({
    name: SESSION_NAME,
    password: sessionSecret,
    maxAge: SESSION_MAX_AGE,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/",
    },
  });
}

/** Persist a fresh login/registration result in the session cookie. */
export async function createSession(result: AuthResult): Promise<void> {
  const session = await authSession();
  await session.update({ user: result.user, tokens: result.tokens });
}

/** Destroy the session cookie. */
export async function destroySession(): Promise<void> {
  const session = await authSession();
  await session.clear();
}

/**
 * Return the signed-in user, or `null`. Transparently refreshes the backend
 * access token when it is about to expire; if the refresh token is rejected
 * the session is cleared.
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  const session = await authSession();
  const payload = session.data;

  if (!payload?.user || !payload.tokens?.accessToken || !payload.tokens?.refreshToken) {
    return null;
  }

  if (!needsRefresh(payload.tokens)) {
    return payload.user;
  }

  try {
    const tokens = await authService.refresh(payload.tokens.refreshToken);
    await session.update({ tokens });
    return payload.user;
  } catch (error) {
    if (error instanceof ApiError && (error.isUnauthorized || error.status === 400)) {
      await session.clear();
      return null;
    }
    // Transient failure (network / 5xx): keep the session, let the caller retry.
    throw error;
  }
}

/**
 * Return a currently-valid backend access token for the signed-in user, or
 * throw. Use this from server functions that need to call the backend on the
 * user's behalf.
 */
export async function requireAccessToken(): Promise<string> {
  const session = await authSession();
  const payload = session.data;

  if (!payload?.tokens?.refreshToken) {
    throw new ApiError("Not authenticated.", 401);
  }

  if (needsRefresh(payload.tokens)) {
    const tokens = await authService.refresh(payload.tokens.refreshToken);
    await session.update({ tokens });
    return tokens.accessToken;
  }

  return payload.tokens.accessToken;
}

function needsRefresh(tokens: AuthTokens): boolean {
  if (tokens.accessTokenExpiresAt == null) return false;
  return Date.now() >= tokens.accessTokenExpiresAt - REFRESH_SKEW_MS;
}
