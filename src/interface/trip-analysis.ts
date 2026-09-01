export interface TripAnalysisStatus {
  tripId: string;
  total: number;
  uploaded: number;
  queued: number;
  processing: number;
  analyzed: number;
  failed: number;
  percentage: number;
  readyToGenerate: boolean;
}

export interface RawTripAnalysisStatus {
  tripId?: string;
  total?: number;
  uploaded?: number;
  queued?: number;
  processing?: number;
  analyzed?: number;
  failed?: number;
  percentage?: number;
  readyToGenerate?: boolean;
}
