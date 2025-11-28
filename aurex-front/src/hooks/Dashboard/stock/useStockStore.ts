import { create } from "zustand";
import { Stock, Product } from "../../../interfaces/Product";
import { PaginationInfo } from "../../../components/Dashboard/Table/Table";

export interface ProductWithStock extends Product {
  Stocks?: Stock[];
}

interface StockState {
  data: Stock[];
  productsWithStock: ProductWithStock[];
  pagination: PaginationInfo | null;
  movements: any[];
  loading: {
    get: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    getProducts: boolean;
    getMovements: boolean;
  };
  setLoading: (key: keyof StockState["loading"], value: boolean) => void;
  setStocks: (stocks: Stock[]) => void;
  addStock: (stock: Stock) => void;
  updateStock: (stock: Stock) => void;
  removeStock: (id: string) => void;
  setProductsWithStock: (products: ProductWithStock[]) => void;
  setPagination: (pagination: PaginationInfo | null) => void;
  setMovements: (movements: any[]) => void;
}

// Store de Zustand
const useStockStore = create<StockState>((set) => ({
  data: [],
  productsWithStock: [],
  pagination: null,
  movements: [],
  loading: {
    get: false,
    create: false,
    update: false,
    delete: false,
    getProducts: false,
    getMovements: false,
  },
  setLoading: (key, value) =>
    set((state) => ({
      loading: { ...state.loading, [key]: value },
    })),
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
  setProductsWithStock: (products) => set({ productsWithStock: products }),
  setPagination: (pagination) => set({ pagination }),
  setMovements: (movements) => set({ movements }),
}));

export default useStockStore;
