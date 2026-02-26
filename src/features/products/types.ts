import { BrandItem } from "@/features/brands/types";
import { CategoryItem } from "@/features/categories/types";
import { ManufacturerItem } from "@/features/manufacturers/types";
import { VariantPackSize, VariantPackType } from "@/features/variants/types";

export type ProductStatus = "DRAFT" | "QUEUE" | "LIVE"
export interface CreateProductPayload {
  description?: string;
  brandId?: string;
  subcategoryId?: string;
  variantId?: string;
  packSizeId?: string;
  packTypeId?: string;
  status?: string;
  price?: number;
  discount?: number;
  thumbnail?: File | null;
  images?: File[] | null;
  deleteImages?: string[];
  createImages?: string[];
  deleteThumbnail?: string;
  file?: File | null
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
  packSize: VariantPackSize;
  packType: VariantPackType;
  price: string;
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
  totalProducts: number;
  totalVariants: number;
  drafts: number;
  archived: number;
}