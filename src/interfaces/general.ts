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
  priceSort?: string;
  brandId?: string;
  categoryId?: string;
  categoryIds?: string;
  subcategoryIds?: string;
  variant?: string;
  isActive?: boolean;
  includeRelations?: boolean;
  parentId?: string;
  includeProductCount?: boolean;
  includeChildren?: boolean;
}

export interface MutationResponse<T> {
  message: string;
  status: string;
  success: boolean;
  data: T;
}

export interface ConfirmationData {
  message: string;
  success: boolean;
  paymentDetails: {
    transactionReference: string,
    amountPaid: string, 
    paidOn: string; 
    paymentMethod: string;
  }
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

export interface PaginatedOrdersResponse<T> {
  status: string;
  success: boolean;
  data: {
    orders: T[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      nextPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  // result: T[];
  // count: number;
  // next: boolean;
  // prev: boolean;
}