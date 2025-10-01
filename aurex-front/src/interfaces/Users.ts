export interface User {
  id?: string;
  name: string;
  email: string;
  photo: string;
  phone?: string;
  rol: UserRol;
  status: UserStatus;
  // Campos específicos para compradores
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  // Campos específicos para vendedores
  businessId?: string;
}

export enum UserRol {
  ANY = "",
  ADMIN = "Administrador",
  DISPACHER = "Despachador",
  SELLER = "Vendedor",
  CLIENT = "Comprador",
}

export enum UserStatus {
  WAITING = "En espera",
  ACTIVE = "Activo",
  BLOCKED = "Bloqueado",
}

export interface LoginData {
  email: string;
  password: string;
}

export const initLoginData = (): LoginData => ({
  email: "",
  password: "",
});

export interface Business {
  id?: string;
  businessName: string;
  businessType: string;
  businessDescription: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  taxId: string;
  bankAccount: string;
  userId?: string;
}

export interface CompleteUserRegistration {
  user: User;
  business?: Business;
}

export interface CompradorRegistrationData {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface VendedorRegistrationData {
  name: string;
  phone: string;
  businessName: string;
  businessType: string;
  businessDescription: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  taxId: string;
  bankAccount: string;
}

export const initUser = (): User => ({
  name: "",
  email: "",
  photo: "",
  rol: UserRol.CLIENT,
  status: UserStatus.WAITING,
});

export const initBusiness = (): Business => ({
  businessName: "",
  businessType: "",
  businessDescription: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  taxId: "",
  bankAccount: "",
});

export const initCompradorRegistration = (): CompradorRegistrationData => ({
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
});

export const initVendedorRegistration = (): VendedorRegistrationData => ({
  name: "",
  phone: "",
  businessName: "",
  businessType: "",
  businessDescription: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  taxId: "",
  bankAccount: "",
});
