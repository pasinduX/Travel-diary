import { useRouteContext } from "@tanstack/react-router";

import type { User } from "@/interface/auth";

/**
 * The currently signed-in user (or `null`), resolved once in the root route's
 * `beforeLoad` and read from route context here. Reactive to `router.invalidate()`.
 */
export function useCurrentUser(): User | null {
  const context = useRouteContext({ from: "__root__" }) as { user?: User | null };
  return context.user ?? null;
}
