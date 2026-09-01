export interface PricingLimits {
  numberOfTrips: number;
  maxImages: number;
}

export interface PricingPlan {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  limits: PricingLimits;
  isActive: boolean;
  sortOrder: number;
}

export interface RawPricingPlan {
  id?: string;
  slug?: string;
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  interval?: string;
  features?: string[];
  limits?: Partial<PricingLimits>;
  isActive?: boolean;
  sortOrder?: number;
}

export interface RawPricingListResponse {
  data?: RawPricingPlan[] | null;
}

export interface RawPricingResponse {
  data?: RawPricingPlan | null;
}
