export interface Storage {
  id?: string;
  rag: string;
  site: string;
  positions: number;
  currentCapacity: number;
  totalCapacity: number;
  disabled: boolean;
}

export const initStorage = (): Storage => ({
  rag: "",
  site: "",
  positions: 0,
  currentCapacity: 0,
  totalCapacity: 0,
  disabled: false,
});
