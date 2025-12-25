export type BrandStatus = "DISCONTINUED" | "ACTIVE" | "INACTIVE"
export interface CreateBrandPayload {
  name?: string;
  description?: string;
  manufacturerId?: string;
  logo?: string;
  status?: string;
}
export interface BrandItem {
  id: string;
  name: string;
  description: string;
  logo: string;
  manufacturerId: string;
  status: BrandStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  deletedBy: string;
  updatedBy: string;
}

export interface BrandProductItem {
  id: string;
  name: string;
  sku: string;
  status: string;
  price: number;
}

export interface BrandOrderItem {
  id: string;
  name: string;
  sku: string;
  status: string;
  price: number;
}

export interface BrandStatsItem {
  total: number;
  active: number;
  inactive: number;
  recentlyAdded: number;
}
