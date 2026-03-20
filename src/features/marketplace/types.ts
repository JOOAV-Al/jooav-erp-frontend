// ── Product API types ──────────────────────────────────────────────────

import { User } from "@/interfaces/authentication";

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
  priceSort?: string;
  categoryIds?: string;
  subcategoryIds?: string;
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


//Orders
export type OrderStatus = "DRAFT" | "CONFIRMED" | "IN_PROGRESS" | "ASSIGNED" | "COMPLETED" | "CANCELLED" | "PENDING_PAYMENT"
export type OrderAssignmentStatus = "UNASSIGNED" | "REJECTED" | "REASSIGNED" | "PENDING_ACCEPTANCE" | "ACCEPTED"
export interface CreateOrderPayload {
  wholesalerId?: string;
  items?: {
    //We can use this action key during edit or even in creation the initial order since we are always creating one item on an order at a time.
    action?: string
    itemId?: string;
    productId: string;
    quantity: number;
    unitPrice?: number;
  }[];
  item?: {
    //We can use this action key during edit or even in creation the initial order since we are always creating one item on an order at a time.
    action?: string
    itemId?: string;
    productId: string;
    quantity: number;
    unitPrice?: number;
  };
  deliveryAddress?: {
    city?: string;
    state?: string;
    address?: string;
    contactName?: string;
    contactPhone?: string;
  };
  customerNotes?: string;
  status?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  status: string;
  product: Product
}
export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[]
  wholesalerId: string;
  wholesalerBusinessName: string;
  assignedProcurementOfficer: User | null;
  procurementOfficerName: string | null;
  assignedProcurementOfficerId: string | null;
  createdById: string | null;
  subtotal: string;
  totalAmount: string;
  monnifyInvoiceRef: string;
  checkoutUrl: string;
  deliveryAddress: {
    city: string;
    state: string;
    address: string;
    contactName: string;
    contactPhone: string;
  };
  // virtualAccounts: OrderVirtualAccount[];
  wholesaler: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  // wholesaler: {
  //   id: string;
  //   user: {
  //     id: string;
  //     firstName: string;
  //     lastName: string;
  //     email: string;
  //   }
  // };
  customerNotes: string;
  assignmentNotes: string;
  assignmentResponseReason: string;
  status: OrderStatus;
  assignmentStatus: OrderAssignmentStatus;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  assignedAt: string | null;
  assignmentRespondedAt: string | null;
  paymentExpiresAt: string | null;
  orderDate: string | null;
  submittedAt: string;
}
