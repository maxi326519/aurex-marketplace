export interface Search {
  text: string;
  categoria: string;
  masVendido: string;
  destacado: string;
  oferta: string;
}

export type ReactInput = React.ChangeEvent<
  HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
>;