import { ManufacturerItem } from "@/features/manufacturers/types";

export type CategoryStatus = "DISCONTINUED" | "ACTIVE" | "INACTIVE"
export interface CreateCategoryPayload {
  name?: string;
  description?: string;
  parentId?: string;
  sortOrder?: number;
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
  parent: ParentCategoryItem[];
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
  parentId: string | null;
  sortOrder: number;
  productCount: number;
  children: CategoryItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  deletedBy: string;
  updatedBy: string;
}

export interface CategoryStatsItem {
  total: number;
  active: number;
  inactive: number;
  recentlyAdded: number;
}
