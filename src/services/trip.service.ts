/**
 * Trip backend API client. Server-only.
 *
 * Talks to `${API_URL}/api/v1/trips` with the caller's bearer token and
 * returns data in the app's normalised `Trip` shape. Cookie / session
 * concerns live in `session.server.ts`; the RPC boundary is `trip.functions.ts`.
 */
import type { RawTrip, Trip, TripCreateInput, TripUpdateInput } from "@/interface/trip";

import { apiRequest } from "./http.server";

const TRIPS_BASE = "/api/v1/trips";

export async function listTrips(token: string): Promise<Trip[]> {
  const data = await apiRequest<RawTrip[] | null>(TRIPS_BASE, { token });
  return Array.isArray(data) ? data.map(normalizeTrip) : [];
}

export async function getTrip(token: string, id: string): Promise<Trip> {
  const data = await apiRequest<RawTrip>(`${TRIPS_BASE}/${encodeURIComponent(id)}`, {
    token,
  });
  return normalizeTrip(data);
}

export async function createTrip(token: string, input: TripCreateInput): Promise<Trip> {
  const data = await apiRequest<RawTrip>(TRIPS_BASE, {
    method: "POST",
    token,
    body: serializeTripInput(input),
  });
  return normalizeTrip(data);
}

export async function updateTrip(token: string, id: string, input: TripUpdateInput): Promise<Trip> {
  const data = await apiRequest<RawTrip>(`${TRIPS_BASE}/${encodeURIComponent(id)}`, {
    method: "PUT",
    token,
    body: serializeTripInput(input),
  });
  return normalizeTrip(data);
}

export async function deleteTrip(token: string, id: string): Promise<void> {
  await apiRequest(`${TRIPS_BASE}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    token,
  });
}

/* ------------------------------------------------------------------ */

function serializeTripInput(input: TripCreateInput | TripUpdateInput) {
  return {
    title: input.title.trim(),
    destination: input.destination.trim(),
    departure: toRfc3339(input.departure),
    return: toRfc3339(input.return),
    cinematicMood: input.cinematicMood.trim(),
    intention: input.intention?.trim() ?? "",
  };
}

/**
 * The backend parses `departure` / `return` with Go's `time.RFC3339`, so a
 * bare `YYYY-MM-DD` from a date input has to be widened to a full timestamp.
 */
function toRfc3339(value: string): string {
  if (!value) return "";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00Z`) : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function normalizeTrip(raw: RawTrip): Trip {
  return {
    id: String(raw.id ?? ""),
    userId: String(raw.userId ?? ""),
    title: raw.title ?? "",
    destination: raw.destination ?? "",
    departure: raw.departure ?? "",
    return: raw.return ?? "",
    cinematicMood: raw.cinematicMood ?? "",
    intention: raw.intention ?? "",
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
  };
}
