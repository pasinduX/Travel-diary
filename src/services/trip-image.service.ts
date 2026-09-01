/**
 * Trip image backend API client. Server-only.
 *
 * `/api/v1/trips/:id/images` — multipart upload + list. Both endpoints reply
 * with `{ "uploaded": TripImage[] }`.
 *
 * Uploads go to S3 in `us-east-1` synchronously inside the backend request,
 * which is slow over a typical uplink (~20-30s per photo). So we send **one
 * file per request** rather than one large multipart body: a stall or reset
 * only costs that one file, the timeout scales to each file's size, and the
 * caller gets a partial result instead of an all-or-nothing failure.
 */
import { ApiError } from "@/interface/auth";
import type {
  RawTripImage,
  RawTripImageCollection,
  TripImage,
  TripImageUploadResult,
} from "@/interface/trip-image";

import { apiRequest } from "./http.server";

/** Assume a pessimistic ~40 KB/s effective uplink, plus 30s of headroom, capped. */
function uploadTimeoutFor(bytes: number): number {
  return Math.min(10 * 60_000, 30_000 + Math.ceil(bytes / 40));
}

function imagesPath(tripId: string): string {
  return `/api/v1/trips/${encodeURIComponent(tripId)}/images`;
}

export async function uploadTripImages(
  token: string,
  tripId: string,
  files: File[],
): Promise<TripImageUploadResult> {
  const uploaded: TripImage[] = [];
  const failed: TripImageUploadResult["failed"] = [];

  for (const file of files) {
    const form = new FormData();
    form.append("images", file, file.name);

    try {
      const data = await apiRequest<RawTripImageCollection>(imagesPath(tripId), {
        method: "POST",
        token,
        body: form,
        timeoutMs: uploadTimeoutFor(file.size),
      });
      uploaded.push(...normalizeCollection(data));
    } catch (error) {
      failed.push({
        fileName: file.name,
        error: error instanceof ApiError ? error.message : "Upload failed.",
      });
    }
  }

  // Nothing made it and we did try — treat as a hard failure so the caller
  // surfaces the reason rather than a silent empty success.
  if (uploaded.length === 0 && failed.length > 0) {
    throw new ApiError(failed[0].error, 502, { failed });
  }

  return { uploaded, failed };
}

export async function listTripImages(token: string, tripId: string): Promise<TripImage[]> {
  const data = await apiRequest<RawTripImageCollection>(imagesPath(tripId), { token });
  return normalizeCollection(data);
}

/* ------------------------------------------------------------------ */

function normalizeCollection(data: RawTripImageCollection | null): TripImage[] {
  const list = Array.isArray(data?.uploaded) ? data.uploaded : [];
  return list.map(normalizeTripImage);
}

function normalizeTripImage(raw: RawTripImage): TripImage {
  return {
    id: String(raw.id ?? ""),
    tripId: String(raw.tripId ?? ""),
    userId: String(raw.userId ?? ""),
    fileName: raw.fileName ?? "",
    contentType: raw.contentType ?? "",
    fileSizeBytes: Number(raw.fileSizeBytes ?? 0),
    width: Number(raw.width ?? 0),
    height: Number(raw.height ?? 0),
    dimensionName: raw.dimensionName ?? "",
    s3Key: raw.s3Key ?? "",
    s3Url: raw.s3Url ?? "",
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
  };
}
