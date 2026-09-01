import type { JSX } from "react";

import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  LOCALE,
  OG_IMAGE_PATH,
  SITE_NAME,
  TITLE_SUFFIX,
  absoluteUrl,
} from "./site";

/** The shape a route `head()` accepts for meta / link entries in this version. */
type MetaTag = JSX.IntrinsicElements["meta"];
type LinkTag = JSX.IntrinsicElements["link"];

/**
 * TanStack Router renders `{ "script:ld+json": {...} }` meta entries as
 * `<script type="application/ld+json">`, but that key isn't in the `<meta>`
 * prop type — this helper adds it back with a single localised cast.
 */
export function ldJson(data: Record<string, unknown>): MetaTag {
  return { "script:ld+json": data } as unknown as MetaTag;
}

export interface SeoInput {
  /** Page title. Omit on the homepage to use the brand default. */
  title?: string;
  /** Append the " · VoyaLoom" suffix to `title`. Default true (false for home). */
  appendSuffix?: boolean;
  description?: string;
  /** Path (e.g. "/faq") or absolute URL for the canonical + og:url. */
  path?: string;
  /** Social image path/URL. Defaults to the site OG image. */
  image?: string;
  imageAlt?: string;
  /** og:type — "website" (default) or "article". */
  type?: "website" | "article";
  /**
   * Indexing:
   *  - "index"   → indexable, followed (default; no robots tag emitted)
   *  - "follow"  → noindex, follow  (utility pages: login, demos)
   *  - "private" → noindex, nofollow (authenticated app, callbacks)
   */
  robots?: "index" | "follow" | "private";
}

/**
 * Build a consistent `head()` payload (meta + canonical link) for a route.
 *
 *   head: () => seo({ title: "How it works", description: "...", path: "/how-it-works" })
 */
export function seo(input: SeoInput = {}): {
  meta: MetaTag[];
  links: LinkTag[];
} {
  const {
    title,
    appendSuffix = true,
    description = DEFAULT_DESCRIPTION,
    path,
    image = OG_IMAGE_PATH,
    imageAlt = "VoyaLoom — turn your travel photos into a cinematic album",
    type = "website",
    robots = "index",
  } = input;

  const fullTitle = title ? (appendSuffix ? `${title}${TITLE_SUFFIX}` : title) : DEFAULT_TITLE;

  const canonical = path ? absoluteUrl(path) : undefined;
  const imageUrl = absoluteUrl(image);

  const meta: MetaTag[] = [
    { title: fullTitle } as MetaTag,
    { name: "description", content: description },

    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: LOCALE },
    { property: "og:image", content: imageUrl },
    { property: "og:image:alt", content: imageAlt },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: imageAlt },
  ];

  if (canonical) {
    meta.push({ property: "og:url", content: canonical });
  }

  if (robots === "follow") {
    meta.push({ name: "robots", content: "noindex, follow" });
  } else if (robots === "private") {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  }

  const links: LinkTag[] = [];
  if (canonical) {
    links.push({ rel: "canonical", href: canonical });
  }

  return { meta, links };
}
