import { Product } from "./Product";

export interface Movement {
  id?: string;
  date: Date | null;
  items: Product[];
  subtotal: number;
  iva: number;
  totalUsd: number;
  totalVes: number;
  concesionarioId: string;
}

export interface MovementFilter {
  date: string;
  concesionarioId: string;
}

export const initMovement = (): Movement => ({
  id: "",
  date: null,
  items: [],
  subtotal: 0,
  iva: 0,
  totalUsd: 0,
  totalVes: 0,
  concesionarioId: "",
});

export const initMovementFilter = (): MovementFilter => ({
  date: "",
  concesionarioId: "",
});
