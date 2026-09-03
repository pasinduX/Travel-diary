import type { AlbumPlan } from "@/interface/album";
import { apiRequest } from "./http.server";

function albumPath(tripId: string): string {
  return `/api/v1/trips/${encodeURIComponent(tripId)}/album`;
}

export async function getAlbum(token: string, tripId: string): Promise<AlbumPlan> {
  return apiRequest<AlbumPlan>(albumPath(tripId), { token });
}

export async function generateAlbum(token: string, tripId: string): Promise<AlbumPlan> {
  // AI album composition can take longer than ordinary API reads.
  return apiRequest<AlbumPlan>(`${albumPath(tripId)}/generate`, {
    method: "POST",
    token,
    timeoutMs: 180_000,
  });
}
