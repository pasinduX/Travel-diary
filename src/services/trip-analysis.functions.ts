import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { TripAnalysisStatus } from "@/interface/trip-analysis";

import { toClientError } from "./service-error";
import { requireAccessToken } from "./session.server";
import * as analysisService from "./trip-analysis.service";

export const getTripAnalysisStatusFn = createServerFn({ method: "GET" })
  .validator(z.object({ tripId: z.string().min(1) }))
  .handler(async ({ data }): Promise<TripAnalysisStatus> => {
    try {
      return await analysisService.getTripAnalysisStatus(await requireAccessToken(), data.tripId);
    } catch (error) {
      toClientError(error);
    }
  });
