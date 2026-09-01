/** Server-only client for public pricing and authenticated plan APIs. */
import type {
  PricingPlan,
  RawPricingListResponse,
  RawPricingPlan,
  RawPricingResponse,
} from "@/interface/pricing";

import { apiRequest } from "./http.server";

export async function listPricingPlans(): Promise<PricingPlan[]> {
  const response = await apiRequest<RawPricingListResponse>("/api/v1/pricing");
  return Array.isArray(response?.data) ? response.data.map(normalizePricingPlan) : [];
}

export async function getCurrentPricingPlan(token: string): Promise<PricingPlan> {
  const response = await apiRequest<RawPricingResponse>("/api/v1/auth/plan", { token });
  return normalizePricingPlan(response?.data);
}

export async function changePricingPlan(token: string, slug: string): Promise<PricingPlan> {
  const response = await apiRequest<RawPricingResponse>("/api/v1/auth/plan", {
    method: "PUT",
    token,
    body: { slug },
  });
  return normalizePricingPlan(response?.data);
}

function normalizePricingPlan(raw: RawPricingPlan | null | undefined): PricingPlan {
  return {
    id: String(raw?.id ?? ""),
    slug: raw?.slug ?? "",
    name: raw?.name ?? "",
    description: raw?.description ?? "",
    price: Number(raw?.price ?? 0),
    currency: raw?.currency ?? "USD",
    interval: raw?.interval ?? "month",
    features: Array.isArray(raw?.features) ? raw.features : [],
    limits: {
      numberOfTrips: Number(raw?.limits?.numberOfTrips ?? 0),
      maxImages: Number(raw?.limits?.maxImages ?? 0),
    },
    isActive: raw?.isActive ?? false,
    sortOrder: Number(raw?.sortOrder ?? 0),
  };
}
