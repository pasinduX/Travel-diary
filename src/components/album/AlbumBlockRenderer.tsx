import type { AlbumBlock } from "@/interface/album";
import {
  AlbumCover,
  ChapterSplit,
  ClosingFrame,
  ChapterTransition,
  EditorialGrid,
  FilmStrip,
  FullBleedImage,
  FullBleedQuote,
  ImageCaption,
  LandscapePair,
  Panorama,
  PortraitPair,
  StoryText,
} from "./blocks";

interface AlbumBlockRendererProps {
  block: AlbumBlock;
  images: Record<string, string>;
}

export function AlbumBlockRenderer({ block, images }: AlbumBlockRendererProps) {
  switch (block.type) {
    case "album_cover":
      return <AlbumCover block={block} images={images} />;
    case "chapter_split":
      return <ChapterSplit block={block} images={images} />;
    case "full_bleed_image":
      return <FullBleedImage block={block} images={images} />;
    case "full_bleed_quote":
      return <FullBleedQuote block={block} images={images} />;
    case "editorial_grid":
      return <EditorialGrid block={block} images={images} />;
    case "portrait_pair":
      return <PortraitPair block={block} images={images} />;
    case "landscape_pair":
      return <LandscapePair block={block} images={images} />;
    case "image_caption":
      return <ImageCaption block={block} images={images} />;
    case "panorama":
      return <Panorama block={block} images={images} />;
    case "film_strip":
      return <FilmStrip block={block} images={images} />;
    case "story_text":
      return <StoryText block={block} />;
    case "chapter_transition":
      return <ChapterTransition block={block} images={images} />;
    case "closing_frame":
      return <ClosingFrame block={block} images={images} />;
    default:
      return null;
  }
}
