/**
 * Client-callable trip image RPC layer.
 *
 * Upload accepts a `FormData` payload (multipart) with a `tripId` field and
 * one or more `images` file parts. The access token is resolved from the
 * session server-side and never reaches the browser.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  type TripImage,
  type TripImageUploadResult,
} from "@/interface/trip-image";

import { requireAccessToken } from "./session.server";
import { toClientError } from "./service-error";
import * as tripImageService from "./trip-image.service";

const acceptedTypes = new Set<string>(ACCEPTED_IMAGE_TYPES);

export const uploadTripImagesFn = createServerFn({ method: "POST" })
  .validator((payload: unknown): FormData => {
    if (!(payload instanceof FormData)) {
      throw new Error("Expected an image upload form.");
    }
    return payload;
  })
  .handler(async ({ data }): Promise<TripImageUploadResult> => {
    const tripId = String(data.get("tripId") ?? "").trim();
    if (!tripId) throw new Error("Missing trip reference.");

    const files = data
      .getAll("images")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (files.length === 0) throw new Error("Choose at least one image.");

    for (const file of files) {
      if (file.size > MAX_IMAGE_BYTES) {
        throw new Error(`"${file.name}" is larger than 15 MB.`);
      }
      if (file.type && !acceptedTypes.has(file.type)) {
        throw new Error(`"${file.name}" isn't a supported image type (JPEG, PNG, or GIF).`);
      }
    }

    try {
      const token = await requireAccessToken();
      return await tripImageService.uploadTripImages(token, tripId, files);
    } catch (error) {
      toClientError(error);
    }
  });

export const listTripImagesFn = createServerFn({ method: "GET" })
  .validator(z.object({ tripId: z.string().min(1) }))
  .handler(async ({ data }): Promise<TripImage[]> => {
    try {
      return await tripImageService.listTripImages(await requireAccessToken(), data.tripId);
    } catch (error) {
      toClientError(error);
    }
  });

export const deleteTripImageFn = createServerFn({ method: "POST" })
  .validator(z.object({ tripId: z.string().min(1), imageId: z.string().min(1) }))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    try {
      await tripImageService.deleteTripImage(await requireAccessToken(), data.tripId, data.imageId);
      return { ok: true };
    } catch (error) {
      toClientError(error);
    }
  });
