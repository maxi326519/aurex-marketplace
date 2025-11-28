import { Category, Product } from "../../../interfaces/Product";
import { PaginationInfo } from "../../../components/Dashboard/Table/Table";
import { create } from "zustand";

interface LoadingState {
  get: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  search: boolean;
}

interface ProductsState {
  data: Product[];
  categories: Category[];
  pagination: PaginationInfo | null;
  loading: LoadingState;
  search: string;
  filters: {
    status: string;
  };
  setLoading: (key: keyof LoadingState, value: boolean) => void;
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  setPagination: (pagination: PaginationInfo | null) => void;
  setSearch: (search: string) => void;
  setFilters: (filters: { status: string }) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  addCategories: (categories: Category[]) => void;
  removeCategories: (categoryIds: string[]) => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  data: [],
  categories: [],
  pagination: null,
  loading: {
    get: false,
    create: false,
    update: false,
    delete: false,
    search: false,
  },
  search: "",
  filters: {
    status: "",
  },
  setLoading: (key, value) =>
    set((state) => ({
      loading: { ...state.loading, [key]: value },
    })),
  setProducts: (products) => set({ data: products }),
  setCategories: (categories) => set({ categories }),
  setPagination: (pagination) => set({ pagination }),
  setSearch: (search) => set({ search }),
  setFilters: (filters) => set({ filters }),
  addProduct: (product) =>
    set((state) => ({
      data: [...state.data, product],
    })),
  updateProduct: (product) =>
    set((state) => ({
      data: state.data.map((p) => (p.id === product.id ? product : p)),
    })),
  removeProduct: (productId) =>
    set((state) => ({
      data: state.data.filter((p) => p.id !== productId),
    })),
  addCategories: (newCategories) =>
    set((state) => ({
      categories: [...state.categories, ...newCategories],
    })),
  removeCategories: (categoryIds) =>
    set((state) => ({
      categories: state.categories.filter(
        (cat) => !categoryIds.includes(cat.id)
      ),
    })),
}));
