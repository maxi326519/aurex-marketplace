export interface PaymentOption {
  id?: string;
  businessId: string;
  type: 'link' | 'transferencia';
  link?: string;
  pasarela?: string;
  cvu?: string;
  cbu?: string;
  otrosDatos?: string;
  createdAt: string;
  updatedAt: string;
}
