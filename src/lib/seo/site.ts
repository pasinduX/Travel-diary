/**
 * Central SEO configuration for VoyaLoom.
 *
 * The canonical/OG absolute URLs are built from `VITE_SITE_URL`. Set that env
 * var to the production origin (no trailing slash), e.g.
 * `VITE_SITE_URL=https://voyaloom.xyz`. It falls back to the placeholder below
 * so local builds still produce valid absolute URLs.
 */
const RAW_SITE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) || "https://voyaloom.xyz";

/** Production origin, normalised without a trailing slash. */
export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

export const SITE_NAME = "VoyaLoom";

export const SITE_TAGLINE = "AI Travel Album Generator";

/** Used as the homepage title and the fallback for pages without their own. */
export const DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;

/** Appended to page-level titles: "Sign in · VoyaLoom". */
export const TITLE_SUFFIX = ` · ${SITE_NAME}`;

export const DEFAULT_DESCRIPTION =
  "VoyaLoom is a free AI travel album generator. Upload your real trip photos and VoyaLoom uses AI to analyze the moments, organize and curate your best shots, add descriptions, and turn them into a cinematic travel album — without replacing your photos.";

/** Broad, honest keyword set. Meta keywords carry little weight but do no harm. */
export const DEFAULT_KEYWORDS = [
  "AI travel album generator",
  "travel photo album generator",
  "AI travel photo organizer",
  "cinematic travel album",
  "create travel album from photos",
  "automatic travel photo album",
  "AI photo curation for travel",
  "turn travel photos into a story",
  "travel memory album",
  "free travel album maker",
];

/** Relative path to the social share image (lives in /public). */
export const OG_IMAGE_PATH = "/og-image.svg";

export const LOCALE = "en_US";

/** Brand colour used for theme-color / manifest. Matches the app's --gold. */
export const THEME_COLOR = "#0b1020";

/** Join a path onto the production origin. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
