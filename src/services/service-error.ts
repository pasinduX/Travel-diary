import { ApiError } from "@/interface/auth";

/**
 * Collapse an internal error into a plain, serialisable `Error` safe to send
 * back to the browser from a server function. `ApiError` metadata (status,
 * body) is intentionally dropped — only the message crosses the boundary.
 */
export function toClientError(error: unknown): never {
  if (error instanceof ApiError) throw new Error(error.message);
  if (error instanceof Error) throw error;
  throw new Error("Something went wrong. Please try again.");
}
