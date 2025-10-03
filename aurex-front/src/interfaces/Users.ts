export interface User {
  id?: string;
  name: string;
  email: string;
  rol: UserRol;
  status: UserStatus;
  photo?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
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

export interface CompradorRegistrationData {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export const initUser = (): User => ({
  name: "",
  email: "",
  photo: "",
  rol: UserRol.CLIENT,
  status: UserStatus.WAITING,
});

export const initCompradorRegistration = (): CompradorRegistrationData => ({
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
});
