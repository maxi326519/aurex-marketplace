export interface Post {
  id?: string;
  date: Date;
  title: string;
  content: string;
  price: number;
  clicks: number;
  images: string[];
  sixInstallments: boolean;
  twelveInstallments: boolean;
  brand: string;
  model: string;
  type: string;
  color: string;
  volume: string;
  dimensions: string;
  otherFeatures: Array<{ name: string; value: string }>;
  faq: Array<{ name: string; value: string }>;
  status: string;
  product?: {
    id: string;
    name: string;
    sku: string;
    ean: string;
    category1: string;
    category2: string;
    totalStock: number;
    status: PostStatus;
  };
  userId?: string;
  productId?: string;
}

export const initPost = (): Post => ({
  id: "",
  userId: "",
  productId: "",
  date: new Date(),
  title: "",
  content: "",
  price: 0,
  clicks: 0,
  images: [],
  sixInstallments: false,
  twelveInstallments: false,
  brand: "",
  model: "",
  type: "",
  color: "",
  volume: "",
  dimensions: "",
  otherFeatures: [],
  faq: [],
  status: PostStatus.PENDIENTE,
});

export enum PostStatus {
  PENDIENTE = "Pendiente",
  PUBLICADO = "Publicado",
  OCULTO = "Oculto",
  BLOQUEADO = "Bloqueado",
}
