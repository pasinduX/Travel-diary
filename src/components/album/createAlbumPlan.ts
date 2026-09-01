import type { AlbumPlan } from "@/interface/album";
import type { TripImage } from "@/interface/trip-image";

export function toImageMap(images: TripImage[]): Record<string, string> {
  return Object.fromEntries(
    images.filter((image) => image.s3Url).map((image) => [image.id, image.s3Url]),
  );
}

export function createAlbumPlan(
  title: string,
  destination: string,
  images: TripImage[],
): AlbumPlan {
  const imageIds = images.filter((image) => image.s3Url).map((image) => image.id);
  const coverId = imageIds[0];
  const remainingIds = imageIds.slice(1);
  const blocks = coverId
    ? [
        { type: "album_cover" as const, imageIds: [coverId], title },
        {
          type: "story_text" as const,
          text: destination
            ? `Moments gathered from ${destination}.`
            : "Moments gathered from your journey.",
        },
        ...(remainingIds.length > 0
          ? [{ type: "editorial_grid" as const, imageIds: remainingIds }]
          : []),
      ]
    : [];

  return {
    title: title || "Your journey",
    subtitle: "A collection of moments, kept together.",
    chapters: [
      {
        id: "journey",
        order: 1,
        eyebrow: "Your photographs",
        title: "The journey so far",
        blocks,
      },
    ],
  };
}
