import { useCallback, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth0 } from "@auth0/auth0-react";

import type { User } from "@/interface/auth";
import { logoutFn } from "@/services/auth.functions";

import { useCurrentUser } from "./use-current-user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isPending: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

/**
 * Client auth hook. Reads the current user from the root route context and
 * exposes mutations that re-sync router state (and therefore every guard and
 * `useCurrentUser` consumer) on success.
 */
export function useAuth(): AuthState {
  const router = useRouter();
  const { logout: logoutFromAuth0 } = useAuth0();
  const user = useCurrentUser();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async <T>(action: () => Promise<T>): Promise<T> => {
      setIsPending(true);
      setError(null);
      try {
        const result = await action();
        await router.invalidate();
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        setError(message);
        throw err instanceof Error ? err : new Error(message);
      } finally {
        setIsPending(false);
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    await run(() => logoutFn());
    if (typeof window !== "undefined") {
      logoutFromAuth0({ logoutParams: { returnTo: window.location.origin } });
    }
  }, [logoutFromAuth0, run]);

  return {
    user,
    isAuthenticated: user != null,
    isPending,
    error,
    logout,
  };
}
