import { ManufacturerItem } from "@/features/manufacturers/types";

export type CategoryStatus = "DISCONTINUED" | "ACTIVE" | "INACTIVE"
export interface CreateCategoryPayload {
  name?: string;
  description?: string;
  parentId?: string;
  sortOrder?: number;
  subcategories?: {
    name: string;
  }[];

  //Editing
  createSubcategories?: {
    name: string;
  }[];
  updateSubcategories?: {
    id: string;
    name: string;
  }[];
  deleteSubcategoryIds?: string[];
}
export interface UpdateBulkCategoryPayload {
  categoryIds?: string[];
}
export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  sortOrder: number;
  category: ParentCategoryItem;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  deletedBy: string;
  updatedBy: string;
}
export interface ParentCategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  productCount: number;
  subcategories: CategoryItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  deletedBy: string;
  updatedBy: string;
}

export interface CategoryStatsItem {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  totalSubcategories: number;
}
