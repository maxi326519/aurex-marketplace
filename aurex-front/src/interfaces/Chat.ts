export interface Chat {
  id: string;
  type: "Venta" | "Reporte";
  state: "Abierto" | "Cerrado";
  UserId: string;
  BusinessId?: string;
  AdminId?: string;
}

export interface Message {
  id: string;
  text: string;
  date: Date;
  type: "Cliente" | "Vendedor" | "Admin";
  ChatId: string;
  UserId?: string;
  BusinessId?: string;
  AdminId?: string;
}
