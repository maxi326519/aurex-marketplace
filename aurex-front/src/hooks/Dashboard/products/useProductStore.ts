import { Category, Product } from "../../../interfaces/Product";
import { create } from "zustand";

interface ProductsState {
  data: Product[];
  categories: Category[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  addCategories: (categories: Category[]) => void;
  removeCategories: (categoryIds: string[]) => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  data: [],
  categories: [],
  suppliers: [],
  loading: false,
  setLoading: (loading) => set({ loading }),
  setProducts: (products) => set({ data: products }),
  setCategories: (categories) => set({ categories }),
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
