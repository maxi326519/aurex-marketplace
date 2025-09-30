import { create } from "zustand";
import { Stock } from "../../../interfaces/Product";

interface StockState {
  data: Stock[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setStocks: (stocks: Stock[]) => void;
  addStock: (stock: Stock) => void;
  updateStock: (stock: Stock) => void;
  removeStock: (id: string) => void;
}

// Store de Zustand
const useStockStore = create<StockState>((set) => ({
  data: [],
  loading: false,
  setLoading: (loading) => set({ loading }),
  setStocks: (stocks) => set({ data: stocks }),
  addStock: (stock) => set((state) => ({ data: [...state.data, stock] })),
  updateStock: (stock) =>
    set((state) => ({
      data: state.data.map((s) => (s.id === stock.id ? stock : s)),
    })),
  removeStock: (id) =>
    set((state) => ({
      data: state.data.filter((s) => s.id !== id),
    })),
}));

export default useStockStore;
