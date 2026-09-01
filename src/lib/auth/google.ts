/**
 * Google OAuth is a full-page redirect flow, so the browser needs the public
 * backend URL. `VITE_API_URL` is exposed on purpose (no secret in it).
 *
 * Flow:
 *   1. Browser navigates to `${VITE_API_URL}/api/v1/auth/google`.
 *   2. Backend redirects to Google, then Google back to the backend's
 *      `/api/v1/auth/google/callback`.
 *   3. Backend is expected to redirect to this app at `/auth/google/callback`
 *      (with `?code=&state=`, or with tokens). See that route for handling.
 */
export function googleSignInUrl(): string {
  const base = import.meta.env.VITE_API_URL;
  if (!base) {
    throw new Error("VITE_API_URL is not set — cannot start Google sign-in.");
  }
  return `${base.replace(/\/+$/, "")}/api/v1/auth/google`;
}

/** Send the browser to the backend to begin Google sign-in. */
export function startGoogleSignIn(): void {
  window.location.assign(googleSignInUrl());
}
