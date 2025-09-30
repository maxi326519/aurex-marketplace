export interface PostsTS {
  id?: string;
  date: Date | string;
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
  status: PostStatus;
  userId?: string;
  productId?: string;
}

export enum PostStatus {
  PENDIENTE = "Pendiente",
  PUBLICADO = "Publicado",
  OCULTO = "Oculto",
  BLOQUEADO = "Bloqueado",
}
