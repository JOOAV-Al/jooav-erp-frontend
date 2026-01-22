export type VariantStatus = "DISCONTINUED" | "ACTIVE" | "INACTIVE"
export interface CreateVariantPayload {
  name?: string;
  description?: string;
  manufacturerId?: string;
  logo?: string;
  status?: string;
}
export interface VariantItem {
  id: string;
  name: string;
  description: string;
  logo: string;
  brandId: string;
  status: VariantStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  deletedBy: string;
  updatedBy: string;
}

export interface VariantProductItem {
  id: string;
  name: string;
  sku: string;
  status: string;
  price: number;
}

export interface VariantOrderItem {
  id: string;
  name: string;
  sku: string;
  status: string;
  price: number;
}

export interface VariantStatsItem {
  totalVariants: number;
  active: number;
  inactive: number;
  recentlyAdded: number;
}
