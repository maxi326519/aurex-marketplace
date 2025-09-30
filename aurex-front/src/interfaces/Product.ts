import { Storage } from "./Storage";

export interface Product {
  id?: string;
  ean: string;
  sku: string;
  name: string;
  price: number;
  volumeType: "Chico" | "Mediano" | "Grande";
  weight: number;
  category1: string;
  category2: string;
  totalStock: number;
  status: ProductStatus;
}

export enum ProductStatus {
  PUBLISHED = "Publicado",
  HIDDEN = "Oculto",
  EMPTY = "Sin stock",
}

export interface Category {
  id: string;
  name: string;
}

export interface Stock {
  id?: string;
  amount: number;
  enabled: number; // Stock available in market
  isFull: boolean;
  ProductId?: string;
  StorageId?: string;
  product?: Partial<Product>;
  storage?: Partial<Storage>;
}

export const initProduct = (): Product => ({
  ean: "",
  sku: "",
  name: "",
  price: 0,
  volumeType: "Chico",
  weight: 0,
  category1: "",
  category2: "",
  totalStock: 0,
  status: ProductStatus.HIDDEN,
});

export const initStock = (): Stock => ({
  amount: 0,
  enabled: 0,
  isFull: true,
});
