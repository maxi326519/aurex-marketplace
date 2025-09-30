export interface UserTS {
  id?: string;
  name: string;
  email: string;
  rol: UserRol;
  status: UserStatus;
  password?: string;
  CompanyId?: string;
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
