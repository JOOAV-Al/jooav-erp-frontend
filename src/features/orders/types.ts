import { ProductItem } from "@/features/products/types";
import { UserItem } from "@/features/users/types";

export type OrderStatus = "SUSPENDED" | "ACTIVE" | "BLOCKED" | "PENDING_APPROVAL" | "DEACTIVATED"
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
  assignedProcurementOfficerId?: string;
}

export interface OrderItem extends ProductItem {
  id: string;
  productId: string;
  productName: ProductItem
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  status: string;
}
export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[]
  wholesalerId: string;
  wholesalerBusinessName: string;
  assignedProcurementOfficerId: string | null;
  procurementOfficerName: string | null;
  subtotal: string;
  totalAmount: string;
  deliveryAddress: {
    city: string;
    state: string;
    address: string;
    contactName: string;
    contactPhone: string;
  };
  customerNotes: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  submittedAt: string;
  orderDate: string;
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
