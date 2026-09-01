/**
 * Client-callable trip RPC layer.
 *
 * Each handler resolves a valid backend access token from the session
 * (`requireAccessToken`, which refreshes if needed) and delegates to
 * `trip.service`. The token never reaches the browser.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { Trip } from "@/interface/trip";

import { requireAccessToken } from "./session.server";
import { toClientError } from "./service-error";
import * as tripService from "./trip.service";

const tripInputSchema = z.object({
  title: z.string().trim().min(1, "Give your trip a title.").max(120),
  destination: z.string().trim().min(1, "Where did the story unfold?").max(120),
  departure: z.string().min(1, "Pick a departure date."),
  return: z.string().min(1, "Pick a return date."),
  cinematicMood: z.string().trim().min(1, "Choose a mood.").max(200),
  intention: z.string().trim().max(500).optional().default(""),
});

const tripIdSchema = z.object({ id: z.string().min(1) });
const tripUpdateSchema = tripInputSchema.extend({ id: z.string().min(1) });

export const listTripsFn = createServerFn({ method: "GET" }).handler(async (): Promise<Trip[]> => {
  try {
    return await tripService.listTrips(await requireAccessToken());
  } catch (error) {
    toClientError(error);
  }
});

export const getTripFn = createServerFn({ method: "GET" })
  .validator(tripIdSchema)
  .handler(async ({ data }): Promise<Trip> => {
    try {
      return await tripService.getTrip(await requireAccessToken(), data.id);
    } catch (error) {
      toClientError(error);
    }
  });

export const createTripFn = createServerFn({ method: "POST" })
  .validator(tripInputSchema)
  .handler(async ({ data }): Promise<Trip> => {
    try {
      return await tripService.createTrip(await requireAccessToken(), data);
    } catch (error) {
      toClientError(error);
    }
  });

export const updateTripFn = createServerFn({ method: "POST" })
  .validator(tripUpdateSchema)
  .handler(async ({ data }): Promise<Trip> => {
    const { id, ...input } = data;
    try {
      return await tripService.updateTrip(await requireAccessToken(), id, input);
    } catch (error) {
      toClientError(error);
    }
  });

export const deleteTripFn = createServerFn({ method: "POST" })
  .validator(tripIdSchema)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    try {
      await tripService.deleteTrip(await requireAccessToken(), data.id);
      return { ok: true };
    } catch (error) {
      toClientError(error);
    }
  });
