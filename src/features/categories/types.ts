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
  parentId: number;
  sortOrder: number;
  parent: string;
  productCount: number;
  children: string[];
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
