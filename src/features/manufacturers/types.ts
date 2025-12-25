export type ManufacturerStatus = "PENDING_APPROVAL" | "ACTIVE" | "SUSPENDED" | "INACTIVE"
export interface CreateManufacturerPayload {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  state?: ManufacturerStatus;
  city?: string;
  country?: string;
  postalCode?: string;
  registrationNumber?: string;
  status?: string;
}
export interface ManufacturerItem {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  state: string;
  city: string;
  country: string;
  postalCode: string;
  registrationNumber: string;
  status: ManufacturerStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  }
  deletedBy: {
    id: string;
    name: string;
    email: string;
  }
  updatedBy: {
    id: string;
    name: string;
    email: string;
  }
  productsCount: number;
  ordersCount: number;
  products: ManufacturerProductItem[];
}

export interface ManufacturerProductItem {
  id: string;
  name: string;
  sku: string;
  status: string;
  price: number;
}

export interface ManufacturerOrderItem {
  id: string;
  name: string;
  sku: string;
  status: string;
  price: number;
}

export interface ManufacturerStatsItem {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  createdThisMonth: number;
  topCountries: {
    country: string;
    count: number;
  }[];
}
