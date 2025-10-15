export interface Business {
  id?: string;
  name: string;
  type: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  taxId: string;
  bankAccount: string;
  averageScore?: number;
  userId?: string;
}

export const initBusiness = (): Business => ({
  name: "",
  type: "",
  description: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  taxId: "",
  bankAccount: "",
  averageScore: 0,
});
