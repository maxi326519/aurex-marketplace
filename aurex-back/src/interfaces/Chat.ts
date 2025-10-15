export interface ChatTS {
  id: string;
  type: "Venta" | "Reporte";
  state: "Abierto" | "Cerrado";
  UserId: string;
  BusinessId?: string;
  AdminId?: string;
  ReportId?: string;
}

export interface MessageTS {
  id: string;
  text: string;
  date: Date;
  type: "Cliente" | "Vendedor" | "Admin";
  ChatId: string;
  UserId?: string;
  BusinessId?: string;
  AdminId?: string;
}
