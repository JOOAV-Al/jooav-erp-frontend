import { BrandItem } from "@/features/brands/types";

export type VariantStatus = "DISCONTINUED" | "ACTIVE" | "INACTIVE"
export interface CreateVariantPayload {
  name?: string;
  description?: string;
  brandId?: string;
  //Creation
  packSizes?: {
    name: string;
  }[];
  packTypes?: {
    name: string;
  }[];

  //Editing
  createPackSizes?: {
    name: string;
  }[];
  updatePackSizes?: {
    id: string;
    name: string;
  }[];
  deletePackSizeIds?: string[];
  createPackTypes?: {
    name: string;
  }[];
  updatePackTypes?: {
    id: string;
    name: string;
  }[];
  deletePackTypeIds?: string[];
}
export interface VariantItem {
  id: string;
  name: string;
  description: string;
  logo: string;
  brandId: string;
  status: VariantStatus;
  packSizes?: VariantPackSize[];
  packTypes?: VariantPackType[];
  brand: BrandItem;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  deletedBy: string;
  updatedBy: string;
}

export interface VariantPackType {
  id: string;
  name: string;
  status: string;
}
export interface VariantPackSize {
  id: string;
  name: string;
  status: string;
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
  totalBrands: number;
  inactiveVariants: number;
  recentlyAdded: number;
}
