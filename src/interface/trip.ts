/**
 * Trip domain types. Mirrors the backend `dto.Trip*` contract
 * (`/api/v1/trips`). All timestamps are RFC 3339 strings.
 */

export interface Trip {
  id: string;
  userId: string;
  title: string;
  destination: string;
  /** RFC 3339 */
  departure: string;
  /** RFC 3339 */
  return: string;
  cinematicMood: string;
  intention: string;
  /** RFC 3339 */
  createdAt: string;
  /** RFC 3339 */
  updatedAt: string;
}

/** Fields the client sends when creating or updating a trip. */
export interface TripInput {
  title: string;
  destination: string;
  /** RFC 3339, or a `YYYY-MM-DD` date (normalised server-side). */
  departure: string;
  /** RFC 3339, or a `YYYY-MM-DD` date (normalised server-side). */
  return: string;
  cinematicMood: string;
  intention?: string;
}

export type TripCreateInput = TripInput;
export type TripUpdateInput = TripInput;

/** Raw trip object from the backend — defensive, every field optional. */
export interface RawTrip {
  id?: string;
  userId?: string;
  title?: string;
  destination?: string;
  departure?: string;
  return?: string;
  cinematicMood?: string;
  intention?: string;
  createdAt?: string;
  updatedAt?: string;
}
