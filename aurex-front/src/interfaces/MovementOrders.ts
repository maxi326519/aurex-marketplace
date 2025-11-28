import { Product } from "./Product";
import { User } from "./Users";

export interface MovementOrder {
  id?: string;
  date: Date;
  receptionDate?: Date;
  type: MovementOrderType;
  state: MovementOrderStatus;
  sheetFile: string;
  remittance: string;
  products?: Product[];
  UserId?: string;
  BusinessId?: string;
  user?: Partial<User>;
}

export enum MovementOrderType {
  ENTRADA = "ENTRADA",
  SALIDA = "SALIDA",
}

export enum MovementOrderStatus {
  ANY = "",
  PENDING = "Pendiente",
  RECEIVED = "Aprobado",
  IN_REVIEW = "En revisión",
  PARTIAL = "Parcial",
  COMPLETED = "Completado",
}

