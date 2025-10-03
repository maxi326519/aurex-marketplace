export interface UserTS {
  id?: string;
  name: string;
  email: string;
  password?: string;
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
