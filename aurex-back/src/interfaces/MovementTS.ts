
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
  entrada = "ENTRADA",
  salida = "SALIDA"
}