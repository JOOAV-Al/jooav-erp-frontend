import { BrandItem } from "@/features/brands/types";
import { CategoryItem } from "@/features/categories/types";
import { ManufacturerItem } from "@/features/manufacturers/types";

export type ProductStatus = "DISCONTINUED" | "ACTIVE" | "INACTIVE"
export interface CreateProductPayload {
  description?: string;
  barcode?: number;
  nafdacNumber?: string;
  brandId?: string;
  categoryId?: string;
  variant?: string;
  packSize?: string;
  packagingType?: string;
  price?: number;
  expiryDate?: string;
  images?: string[];
  isActive?: boolean;
}
export interface ProductItem {
  id: string;
  name: string;
  description: string;
  sku: string;
  barcode: number;
  nafdacNumber: string;
  brandId: string;
  categoryId: string;
  manufacturerId: string;
  variant: string;
  packSize: string;
  packagingType: string;
  price: number;
  expiryDate: string;
  images: string[];
  isActive: boolean;
  brand: BrandItem;
  category: CategoryItem;
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
