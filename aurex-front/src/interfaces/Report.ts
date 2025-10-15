export interface Report {
  id?: string;
  openReason: string;
  closeReason?: string;
  description: string;
  notes?: string;
  state: "Abierto" | "Cerrado";
  date: Date;
  UserId: string;
  BusinessId: string;
  AdminId?: string;
  OrderId: string;
  ChatId?: string;
}
