import { Product } from "./Product";
import { User } from "./Users";

export interface Reception {
  id?: string;
  date: Date;
  state: ReceptionStatus;
  sheetFile: string;
  remittance: string;
  products?: Product[];
  UserId?: string;
  user?: Partial<User>;
}

export enum ReceptionStatus {
  ANY = "",
  PENDING = "Pendiente",
  RECEIVED = "Aprobado",
  IN_REVIEW = "En revisión",
  COMPLETED = "Completado",
}
