import { BrandItem } from "@/features/brands/types";
import { CategoryItem } from "@/features/categories/types";
import { ManufacturerItem } from "@/features/manufacturers/types";

export type ProductStatus = "DISCONTINUED" | "ACTIVE" | "INACTIVE"
export interface CreateProductPayload {
  description?: string;
  brandId?: string;
  subcategoryId?: string;
  variantId?: string;
  packSizeId?: string;
  packTypeId?: string;
  price?: number;
  discount?: number;
  thumbnail?: string;
  images?: string[];
}
export interface ProductItem {
  id: string;
  name: string;
  description: string;
  sku: string;
  brandId: string;
  categoryId: string;
  subcategoryId: string;
  manufacturerId: string;
  variantId: string;
  packSizeId: string;
  packTypeId: string;
  price: number;
  discount: number;
  thumbnail: string;
  images: string[];
  status: string;
  brand: BrandItem;
  subcategory: CategoryItem;
  manufacturer: ManufacturerItem
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  deletedBy: string;
  updatedBy: string;
}

export interface ProductStatsItem {
  total: number;
  active: number;
  inactive: number;
  recentlyAdded: number;
}
