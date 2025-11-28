export interface Business {
  id?: string;
  name: string;
  type: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  averageScore?: number;
  UserId?: string;
}

export const initBusiness = (): Business => ({
  name: "",
  type: "",
  description: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  averageScore: 0,
});
