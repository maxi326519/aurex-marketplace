
export interface MovementsTS {
  id?: string;
  date: string;
  type: MovementsType;
  quantity: number;
  StorageId?: string;
  UserId?: string;
  StockId?: string;
  MovementOrderId?: string;
}

export enum MovementsType {
  ingreso = "Ingreso",
  egreso = "Egreso",
  transferencia = "Transferencia",
  venta = "Venta"
}