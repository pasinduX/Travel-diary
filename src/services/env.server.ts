import process from "node:process";

/**
 * Server-only auth configuration. The `.server.ts` suffix keeps this file (and
 * the `SESSION_SECRET`) out of the client bundle.
 *
 * Read env INSIDE the function, not at module scope — on edge runtimes env is
 * bound per request.
 */
export function getAuthEnv() {
  const apiUrl = process.env.API_URL ?? process.env.VITE_API_URL ?? import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error(
      "Auth is misconfigured: set API_URL (or VITE_API_URL) to the backend base URL.",
    );
  }

  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret || sessionSecret.length < 32) {
    throw new Error(
      "Auth is misconfigured: SESSION_SECRET must be set and at least 32 characters. Generate one with `openssl rand -hex 32`.",
    );
  }

  return {
    /** Backend base URL, trailing slash stripped. */
    apiBaseUrl: apiUrl.replace(/\/+$/, ""),
    sessionSecret,
    isProduction: process.env.NODE_ENV === "production",
  };
}
