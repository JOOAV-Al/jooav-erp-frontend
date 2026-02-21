import { ProductItem } from "@/features/products/types";
import { UserItem } from "@/features/users/types";

export type OrderStatus = "DRAFT" | "ACTIVE" | "BLOCKED" | "PENDING_APPROVAL" | "DEACTIVATED"
export type OrderAssignmentStatus = "UNASSIGNED" | "ACTIVE" | "BLOCKED" | "PENDING_APPROVAL" | "DEACTIVATED"
export interface CreateOrderPayload {
  items?: {
    productId: string;
    quantity: number;
  }[];
  deliveryAddress?: {
    city: string;
    state: string;
    address: string;
    contactName: string;
    contactPhone: string;
  };
  customerNotes?: string;
  status?: string;

  //Assigning procurement officer
  assignedProcurementOfficerId?: string;
  assignmentNotes?: string;
  response?: string;
  reason?: string;
}

export interface UpdateOrderItemStatusPayload {
  processingNotes?: string;
  status?: string;
}

export interface UpdateMultipleOrderItemStatusPayload {
  items?: {
    itemId: string;
    processingNotes?: string;
    status?: string;
  }[];
  bulkNotes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: ProductItem
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  status: string;
  product: ProductItem
}
export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[]
  wholesalerId: string;
  wholesalerBusinessName: string;
  assignedProcurementOfficer: string | null;
  procurementOfficerName: string | null;
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
  virtualAccounts: {
    bankCode: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  wholesaler: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    }
  };
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


export interface OrderStatsItem {
  totalOrders: number;
  activeOrders: number;
  deactivatedOrders: number;
  adminOrders: number;
  totalManufacturers: number;
  archived: number;
  ordersByRole: {
    role: string;
    count: number;
  }[]
  recentRegistrations: number;
}
