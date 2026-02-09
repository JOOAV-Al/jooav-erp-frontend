// import { Role } from "@/lib/rbac/roles";

export interface GeneralFetchingParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
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
  status: string;
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    nextPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
  // result: T[];
  // count: number;
  // next: boolean;
  // prev: boolean;
}
export interface PaginatedObjectResponse<T> {
  status: string;
  success: boolean;
  data: T;
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    nextPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
  // result: T;
  // count: number;
  // next: boolean;
  // prev: boolean;
}

export interface Tab {
  value: string;
  label: string;
  heading?: string;
  content: React.ReactNode;
  actionDropdown?: React.ReactNode;
  statusTag?: React.ReactNode;
}
export interface DrawerTabsProps {
  tabs: Tab[];
}

export interface DialogFormProps {
  // when provided, form will call this with values on submit
  handleSubmitForm?: (values: any) => Promise<void> | void;
  // loading state (e.g. mutation in parent) so UI can show spinner/disable buttons
  loading?: boolean;
  closeDialog?: () => void;
  submitAction?: 'primary' | 'secondary';
}