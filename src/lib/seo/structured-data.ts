/**
 * JSON-LD builders. Every value here is factual — no ratings, reviews, awards,
 * prices, or company claims that can't be backed up.
 *
 * Emit via a route `head()` meta entry:
 *   { "script:ld+json": organizationLd() }
 */
import { FAQ_ITEMS, type FaqItem } from "./faq";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "./site";

type Json = Record<string, unknown>;

export function organizationLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/favicon.svg"),
    description:
      "VoyaLoom is an AI travel album generator that turns your real travel photos into cinematic visual stories.",
  };
}

export function websiteLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
  };
}

/**
 * The product itself. Free, browser-based travel app. `offers` uses price "0"
 * which is the schema.org-valid way to express a free product.
 */
export function softwareApplicationLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires a modern web browser with JavaScript enabled.",
    description: DEFAULT_DESCRIPTION,
    featureList: [
      "Upload real travel photos to a trip",
      "AI analysis of scenes and moments",
      "Automatic photo organization and curation",
      "AI-generated contextual descriptions and quotes",
      "Cinematic scrollable travel album",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
}

export function faqPageLd(items: FaqItem[] = FAQ_ITEMS): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbLd(crumbs: Array<{ name: string; path: string }>): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
