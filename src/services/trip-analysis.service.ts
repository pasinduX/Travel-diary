/** Server-only client for authenticated trip analysis progress. */
import type { RawTripAnalysisStatus, TripAnalysisStatus } from "@/interface/trip-analysis";

import { apiRequest } from "./http.server";

export async function getTripAnalysisStatus(
  token: string,
  tripId: string,
): Promise<TripAnalysisStatus> {
  const raw = await apiRequest<RawTripAnalysisStatus>(
    `/api/v1/trips/${encodeURIComponent(tripId)}/analysis-status`,
    { token },
  );

  const analyzed = Number(raw.analyzed ?? 0);
  const total = Number(raw.total ?? 0);
  return {
    tripId: String(raw.tripId ?? tripId),
    total,
    uploaded: Number(raw.uploaded ?? 0),
    queued: Number(raw.queued ?? 0),
    processing: Number(raw.processing ?? 0),
    analyzed,
    failed: Number(raw.failed ?? 0),
    failures: (raw.failures ?? []).map((failure) => ({
      imageId: String(failure.imageId ?? ""),
      fileName: String(failure.fileName ?? "Photograph"),
      error: String(failure.error ?? "Unknown analysis error"),
    })),
    percentage: clampPercentage(raw.percentage, total > 0 ? (analyzed / total) * 100 : 0),
    readyToGenerate: raw.readyToGenerate === true,
  };
}

function clampPercentage(value: number | undefined, fallback: number): number {
  const percentage = Number(value ?? fallback);
  return Math.min(100, Math.max(0, Number.isFinite(percentage) ? percentage : 0));
}
