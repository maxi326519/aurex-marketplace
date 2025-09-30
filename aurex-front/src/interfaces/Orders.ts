export interface Order {
  id: string;
  date: Date;
  status: OrdersStatus;
  quantity: number;
  totalAmount: number;
  supplier?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productId?: string;
  orderId?: string;
}

export enum OrdersStatus {
  PENDING = "Pendiente",
  PREPARED = "Preparado",
  COMPLETED = "Completado",
  CANCELED = "Cancelado",
}
