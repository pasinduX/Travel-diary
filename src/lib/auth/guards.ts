import { redirect } from "@tanstack/react-router";

import type { User } from "@/interface/auth";

export interface AuthRouteContext {
  user: User | null;
}

/**
 * Use in a route's `beforeLoad` to require a signed-in user. Redirects to
 * `/login` (remembering where the user was headed) otherwise.
 *
 *   beforeLoad: ({ context, location }) => requireAuth(context, location.pathname),
 */
export function requireAuth(context: AuthRouteContext, redirectPath: string): { user: User } {
  if (!context.user) {
    throw redirect({
      to: "/login",
      search: { redirect: redirectPath || undefined },
    });
  }
  return { user: context.user };
}

/**
 * Use in a route's `beforeLoad` to bounce already-authenticated users away
 * from guest-only pages (login / signup).
 */
export function requireGuest(context: AuthRouteContext, to: string = "/dashboard"): void {
  if (context.user) {
    throw redirect({ to });
  }
}
