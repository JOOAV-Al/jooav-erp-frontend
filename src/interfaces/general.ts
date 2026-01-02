export interface GeneralFetchingParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  country?: string;
  state?: string;
  id?: string;
  manufacturerId?: string;
  sortBy?: string;
  sortOrder?: string;
  brandId?: string;
  categoryId?: string;
  variant?: string;
  isActive?: boolean;
  includeRelations?: boolean;
  parentId?: string;
  includeProductCount?: boolean;
  includeChildren?: boolean;
}

export interface PaginatedResponse<T> {
  result: T[];
  count: number;
  next: boolean;
  prev: boolean;
}
export interface PaginatedObjectResponse<T> {
  result: T;
  count: number;
  next: boolean;
  prev: boolean;
}