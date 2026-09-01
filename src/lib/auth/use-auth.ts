import { useCallback, useState } from "react";
import { useRouter } from "@tanstack/react-router";

import type { LoginInput, RegisterInput, User } from "@/interface/auth";
import { loginFn, logoutFn, registerFn } from "@/services/auth.functions";

import { useCurrentUser } from "./use-current-user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isPending: boolean;
  error: string | null;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
}

/**
 * Client auth hook. Reads the current user from the root route context and
 * exposes mutations that re-sync router state (and therefore every guard and
 * `useCurrentUser` consumer) on success.
 */
export function useAuth(): AuthState {
  const router = useRouter();
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

  const login = useCallback((input: LoginInput) => run(() => loginFn({ data: input })), [run]);

  const register = useCallback(
    (input: RegisterInput) => run(() => registerFn({ data: input })),
    [run],
  );

  const logout = useCallback(async () => {
    await run(() => logoutFn());
  }, [run]);

  return {
    user,
    isAuthenticated: user != null,
    isPending,
    error,
    login,
    register,
    logout,
  };
}
