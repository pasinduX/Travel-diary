/**
 * Trip image types. Mirrors the backend `dto.TripImage*` contract
 * (`/api/v1/trips/:id/images`). Timestamps are RFC 3339 strings.
 */

export interface TripImage {
  id: string;
  tripId: string;
  userId: string;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  width: number;
  height: number;
  dimensionName: string;
  s3Key: string;
  s3Url: string;
  /** RFC 3339 */
  createdAt: string;
  /** RFC 3339 */
  updatedAt: string;
}

/** Raw image object from the backend — every field optional / defensive. */
export interface RawTripImage {
  id?: string;
  tripId?: string;
  userId?: string;
  fileName?: string;
  contentType?: string;
  fileSizeBytes?: number;
  width?: number;
  height?: number;
  dimensionName?: string;
  s3Key?: string;
  s3Url?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** `{ "uploaded": RawTripImage[] }` — used by both upload and list endpoints. */
export interface RawTripImageCollection {
  uploaded?: RawTripImage[] | null;
}

/** Result of a batch upload — files are sent one request at a time. */
export interface TripImageUploadResult {
  uploaded: TripImage[];
  failed: Array<{ fileName: string; error: string }>;
}

/** Client-side rules for what the backend can decode (Go stdlib image). */
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"] as const;
export const ACCEPTED_IMAGE_ACCEPT_ATTR = ACCEPTED_IMAGE_TYPES.join(",");
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15 MB per file
