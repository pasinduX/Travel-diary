export type AlbumBlockType =
  | "album_cover"
  | "chapter_split"
  | "full_bleed_image"
  | "full_bleed_quote"
  | "editorial_grid"
  | "portrait_pair"
  | "landscape_pair"
  | "image_caption"
  | "panorama"
  | "film_strip"
  | "story_text"
  | "chapter_transition"
  | "closing_frame";

export type AlbumTextPosition = "left" | "right" | "center" | "top_left" | "top_right";

export interface AlbumPlan {
  title: string;
  subtitle?: string;
  tone?: string;
  chapters: AlbumChapter[];
  quotes?: AlbumQuote[];
}

export interface AlbumQuote {
  from: string;
  to: string;
  text: string;
  order: number;
}

export interface AlbumChapter {
  id: string;
  order: number;
  eyebrow?: string;
  title: string;
  quote?: string;
  description?: string;
  blocks: AlbumBlock[];
}

export interface AlbumBlockBase {
  type: AlbumBlockType;
  imageIds?: string[];
  textPosition?: AlbumTextPosition;
  eyebrow?: string;
  title?: string;
  text?: string;
  quote?: string;
  description?: string;
  caption?: string;
}

export type AlbumBlock = AlbumBlockBase;
