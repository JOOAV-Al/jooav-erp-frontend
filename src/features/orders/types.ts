import { ProductItem } from "@/features/products/types";
import { UserItem } from "@/features/users/types";

export type OrderStatus = "DRAFT" | "CONFIRMED" | "IN_PROGRESS" | "ASSIGNED" | "COMPLETED" | "CANCELLED"
export type OrderAssignmentStatus = "UNASSIGNED" | "ACTIVE" | "BLOCKED" | "PENDING_APPROVAL" | "DEACTIVATED"
export interface CreateOrderPayload {
  wholesalerId?: string;
  items?: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  deliveryAddress?: {
    city?: string;
    state?: string;
    address?: string;
    contactName?: string;
    contactPhone?: string;
  };
  customerNotes?: string;
  status?: string;

  //Assigning procurement officer
  assignedProcurementOfficerId?: string;
  procurementOfficerId?: string;
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

export interface OrderItemProduct {
  name: string;
  thumbnail: string;
  images: string[];
  packSize: {
    name: string;
  },
  packType: {
    name: string;
  }
}
export interface OrderItem {
  id: string;
  productId: string;
  productName: ProductItem
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  status: string;
  product: OrderItemProduct
}
export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[]
  wholesalerId: string;
  wholesalerBusinessName: string;
  assignedProcurementOfficer: UserItem | null;
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
