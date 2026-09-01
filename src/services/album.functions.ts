import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AlbumPlan } from "@/interface/album";
import { requireAccessToken } from "./session.server";
import { toClientError } from "./service-error";
import * as albumService from "./album.service";

const tripIdSchema = z.object({ tripId: z.string().min(1) });

export const getAlbumFn = createServerFn({ method: "GET" })
  .validator(tripIdSchema)
  .handler(async ({ data }): Promise<AlbumPlan> => {
    try {
      return await albumService.getAlbum(await requireAccessToken(), data.tripId);
    } catch (error) {
      toClientError(error);
    }
  });

export const generateAlbumFn = createServerFn({ method: "POST" })
  .validator(tripIdSchema)
  .handler(async ({ data }): Promise<AlbumPlan> => {
    try {
      return await albumService.generateAlbum(await requireAccessToken(), data.tripId);
    } catch (error) {
      toClientError(error);
    }
  });
