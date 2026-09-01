/**
 * Client-callable auth RPC layer (the BFF boundary).
 *
 * Components call these `createServerFn` handlers; the handler body runs
 * server-only, talks to the backend via `auth.service`, and manages the
 * sealed session cookie via `session.server`. Tokens and the backend URL
 * never reach the browser bundle.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { HealthStatus, User } from "@/interface/auth";

import * as authService from "./auth.service";
import { toClientError } from "./service-error";
import { createSession, destroySession, getAuthenticatedUser } from "./session.server";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(40)
    .regex(/^[a-zA-Z0-9_.-]+$/, "Use only letters, numbers, and . _ -"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
});

const loginSchema = z.object({
  username: z.string().trim().min(1, "Enter your username."),
  password: z.string().min(1, "Enter your password."),
});

const googleCallbackSchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
});

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async (): Promise<User | null> => {
    try {
      return await getAuthenticatedUser();
    } catch {
      // Never let a transient auth-service hiccup break page loads.
      return null;
    }
  },
);

export const registerFn = createServerFn({ method: "POST" })
  .validator(registerSchema)
  .handler(async ({ data }): Promise<User> => {
    try {
      const result = await authService.register(data);
      await createSession(result);
      return result.user;
    } catch (error) {
      toClientError(error);
    }
  });

export const loginFn = createServerFn({ method: "POST" })
  .validator(loginSchema)
  .handler(async ({ data }): Promise<User> => {
    try {
      const result = await authService.login(data);
      await createSession(result);
      return result.user;
    } catch (error) {
      toClientError(error);
    }
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ ok: true }> => {
    await destroySession();
    return { ok: true };
  },
);

export const googleCallbackFn = createServerFn({ method: "POST" })
  .validator(googleCallbackSchema)
  .handler(async ({ data }): Promise<User> => {
    try {
      const result = await authService.googleCallback(data);
      await createSession(result);
      return result.user;
    } catch (error) {
      toClientError(error);
    }
  });

export const healthCheckFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<HealthStatus> => authService.health(),
);
