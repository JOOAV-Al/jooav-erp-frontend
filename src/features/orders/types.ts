import { ProductItem } from "@/features/products/types";
import { UserItem } from "@/features/users/types";

export type OrderStatus = "DRAFT" | "CONFIRMED" | "IN_PROGRESS" | "ASSIGNED" | "COMPLETED" | "CANCELLED" | "PENDING_PAYMENT"
export type OrderAssignmentStatus = "UNASSIGNED" | "ACTIVE" | "BLOCKED" | "PENDING_APPROVAL" | "DEACTIVATED"
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

export interface OrderVirtualAccount {
  bankCode: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
};
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
  virtualAccounts: OrderVirtualAccount[];
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
export interface OrderStatsItem {
  totalOrders: number;
  summary: {
    activeOrders: number;
    completedOrders: number;
    cancelledOrders: number;
  }
  statusBreakdown: {
    draft: number;
    confirmed: number;
    assigned: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
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
