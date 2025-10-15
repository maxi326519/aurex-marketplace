export interface ReportTS {
  id?: string;
  openReason: string;
  closeReason?: string;
  description: string;
  notes?: string;
  state: "Abierto" | "Cerrado";
  date: Date;
  UserId?: string;
  AdminId?: string;
  BusinessId?: string;
  OrderId?: string;
  ChatId?: string;
}
