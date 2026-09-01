/**
 * Dashboard data boundary. The access token stays on the server while this
 * combines the authenticated trip and image APIs for the dashboard view.
 */
import { createServerFn } from "@tanstack/react-start";

import type { Trip } from "@/interface/trip";

import { requireAccessToken } from "./session.server";
import { toClientError } from "./service-error";
import * as tripImageService from "./trip-image.service";
import * as tripService from "./trip.service";

export interface DashboardTrip extends Trip {
  imageCount: number;
  coverImageUrl: string;
}

export interface DashboardData {
  trips: DashboardTrip[];
  imageCount: number;
}

export const getDashboardDataFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<DashboardData> => {
    try {
      const token = await requireAccessToken();
      const trips = await tripService.listTrips(token);
      const dashboardTrips = await Promise.all(
        trips.map(async (trip): Promise<DashboardTrip> => {
          const images = await tripImageService.listTripImages(token, trip.id);
          return {
            ...trip,
            imageCount: images.length,
            coverImageUrl: images[0]?.s3Url ?? "",
          };
        }),
      );

      return {
        trips: dashboardTrips,
        imageCount: dashboardTrips.reduce((total, trip) => total + trip.imageCount, 0),
      };
    } catch (error) {
      toClientError(error);
    }
  },
);
