import { Order, OrderItem } from "./Orders";

export interface OrderManagement extends Order {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItemManagement[];
  createdAt: Date;
  updatedAt: Date;
  pickedAt?: Date;
  preparedAt?: Date;
  completedAt?: Date;
  trackingNumber?: string;
  courier?: string;
  notes?: string;
}

export interface OrderItemManagement extends OrderItem {
  product: {
    id: string;
    name: string;
    sku: string;
    ean: string;
    position?: string; // Posición en el depósito
  };
  pickedQuantity?: number;
  scannedEAN?: string;
  isPicked?: boolean;
  isScanned?: boolean;
  pickedAt?: Date;
  scannedAt?: Date;
}

export interface PickOrderRequest {
  orderId: string;
  items: {
    itemId: string;
    quantity: number;
  }[];
}

export interface ScanProductRequest {
  orderId: string;
  itemId: string;
  ean: string;
}

export interface EgressOrderRequest {
  orderId: string;
  trackingNumber: string;
  courier: string;
  notes?: string;
}

export enum OrderAction {
  PICK = "pick",
  SCAN = "scan",
  EGRESS = "egress",
  CANCEL = "cancel",
  REIMPRINT = "reimprint"
}

export interface OrderActionLog {
  id: string;
  orderId: string;
  action: OrderAction;
  userId: string;
  timestamp: Date;
  details?: string;
  previousStatus?: string;
  newStatus?: string;
}
