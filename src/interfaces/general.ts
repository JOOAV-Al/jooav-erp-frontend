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
}

export interface PaginatedOrdersResponse<T> {
  status: string;
  success: boolean;
  data: {
    data: T[];
    meta: {
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

export interface MutationResponse<T> {
  message: string;
  status: string;
  success: boolean;
  data: T;
}

export interface Tab {
  value: string;
  label: string;
  heading?: string;
  content: React.ReactNode;
  actionDropdown?: React.ReactNode;
  statusTag?: React.ReactNode;
  loading?: boolean
  /** 
   * The `id` of the <form> inside this tab's content.
   * The drawer footer's submit buttons will use `form={activeFormId}` to
   * target whichever tab is currently active.
   *
   * - Manual tab  → "product-form"  (already on the <form> inside ProductForm)
   * - Bulk tab    → "bulk-upload-form"  (a hidden <form> added to the tab content)
   */
  formId?: string;
}
export interface DrawerTabsProps {
  tabs: Tab[];
  /**
   * Fires whenever the user switches tabs.
   * Passes the active tab's `formId` (or undefined if the tab has none).
   * The parent uses this to update which form the footer buttons target.
   */
  onActiveFormIdChange?: (formId: string | undefined) => void;
}

export interface DialogFormProps {
  // when provided, form will call this with values on submit
  handleSubmitForm?: (values: any) => Promise<void> | void;
  // loading state (e.g. mutation in parent) so UI can show spinner/disable buttons
  loading?: boolean;
  closeDialog?: () => void;
  submitAction?: 'primary' | 'secondary';
  onResetReady?: (resetFn: () => void) => void
}