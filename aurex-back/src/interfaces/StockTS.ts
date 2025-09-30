import { ProductTS } from "./ProductTS";
import { StorageTS } from "./StorageTS";

export interface StockTS {
  id?: string;
  amount: number;
  enabled: number;
  isFull: boolean;
  ProductId?: string;
  StorageId?: string;
  product?: Partial<ProductTS>;
  storage?: Partial<StorageTS>;
}