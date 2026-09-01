# Auth

BFF-style auth against the backend at `API_URL` (`/api/v1/auth/*`).

## How it fits together

```
interface/auth.ts        types + ApiError (shared)
services/
  env.server.ts          reads API_URL / SESSION_SECRET (server-only)
  http.server.ts         JSON fetch wrapper → normalises errors to ApiError
  auth.service.ts        backend calls: register / login / refresh / googleCallback / health
  session.server.ts      sealed (AES-encrypted, httpOnly) cookie holding the token pair
  auth.functions.ts      createServerFn RPC boundary the client calls
lib/auth/
  guards.ts              requireAuth / requireGuest for route beforeLoad
  use-auth.ts            client hook: user + login/register/logout
  use-current-user.ts    reads user from root route context
  google.ts              builds the public Google redirect URL
```

## Token handling

The browser never sees the access or refresh token. `login`/`register` store both
inside an encrypted, signed, `httpOnly`, `SameSite=Lax` cookie
(`voyaloom_session`). `getAuthenticatedUser()` transparently refreshes the access
token via `/api/v1/auth/refresh` when it is close to expiry, and clears the
session if the refresh token is rejected.

The current user is resolved once per navigation in `routes/__root.tsx`
`beforeLoad` and placed on route context. Call `router.invalidate()` after any
auth mutation to re-sync guards and `useCurrentUser`.

## Config

Set in `.env` (see `.env.example`):

- `VITE_API_URL` – public, used only for the Google full-page redirect.
- `API_URL` – server-only backend base URL (defaults to `VITE_API_URL`).
- `SESSION_SECRET` – ≥32 chars, encrypts the session cookie. `openssl rand -hex 32`.

## Google OAuth

`startGoogleSignIn()` navigates to `${VITE_API_URL}/api/v1/auth/google`. This
code assumes the backend, after handling Google's callback, redirects back to
this app at `/auth/google/callback?code=&state=`; that route
(`routes/auth.google.callback.tsx`) forwards the pair to the backend, stores the
session and continues to `/dashboard`. If your backend instead finishes the flow
itself, point its post-login redirect straight at `/dashboard` and delete that
route.
