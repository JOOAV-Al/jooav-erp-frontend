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