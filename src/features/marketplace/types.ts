// ── Product API types ──────────────────────────────────────────────────

export interface ProductBrand {
  id: string;
  name: string;
  manufacturer: { id: string; name: string };
}

export interface ProductVariant {
  id: string;
  name: string;
  description?: string;
}

export interface ProductSubcategory {
  id: string;
  name: string;
  slug: string;
  category: { id: string; name: string; slug: string };
}

export interface ProductManufacturer {
  id: string;
  name: string;
}

export interface ProductPackSize {
  id: string;
  name: string;
}

export interface ProductPackType {
  id: string;
  name: string;
}

export type ProductStatus = "LIVE" | "QUEUE" | "DRAFT" | "ARCHIVED";

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  brandId: string;
  variantId: string;
  subcategoryId: string;
  manufacturerId: string;
  packSizeId: string;
  packTypeId: string;
  price: string;
  discount: string;
  quantity: number;
  images: string[];
  thumbnail: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  brand?: ProductBrand;
  variant?: ProductVariant;
  subcategory?: ProductSubcategory;
  manufacturer?: ProductManufacturer;
  packSize?: ProductPackSize;
  packType?: ProductPackType;
}

// ── Pagination types ───────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductsResponse {
  status: string;
  message: string;
  data: Product[];
  meta: PaginationMeta;
  timestamp: string;
}

// ── Filter types ───────────────────────────────────────────────────────

export interface ProductFilters {
  page: number;
  limit: number;
  search: string;
  brandId: string;
  categoryId: string;
  variant: string;
  status: ProductStatus | "";
  includeRelations: boolean;
}

export const DEFAULT_PRODUCT_FILTERS: ProductFilters = {
  page: 1,
  limit: 20,
  search: "",
  brandId: "",
  categoryId: "",
  variant: "",
  status: "",
  includeRelations: true,
};

// ── Category types ─────────────────────────────────────────────────────

export interface CategorySubcategory {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  subcategories?: CategorySubcategory[];
}

export interface CategoriesResponse {
  status: string;
  message: string;
  data: Category[];
  meta: PaginationMeta;
  timestamp: string;
}
