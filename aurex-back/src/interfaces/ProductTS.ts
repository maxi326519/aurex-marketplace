export interface ProductTS {
  id: string;
  ean: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  volumeType: number;
  weight: number;
  totalStock: number;
  status: ProductStatus;
}

export enum ProductStatus {
  PUBLISHED = "Publicado",
  HIDDEN = "Oculto",
  EMPTY = "Sin stock",
}
