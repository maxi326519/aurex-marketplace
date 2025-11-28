import { ProductTS } from "./ProductTS";
import { UserTS } from "./UserTS";

export interface MovementOrderTS {
  id?: string;
  date: Date;
  receptionDate?: Date;
  type: MovementOrderType;
  state: MovementOrderStatus;
  sheetFile: string;
  remittance: string;
  products?: ProductTS[];
  userId?: string;
  user?: Partial<UserTS>;
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

