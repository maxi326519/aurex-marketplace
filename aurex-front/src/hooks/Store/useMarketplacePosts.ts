import { create } from "zustand";
import { Post } from "../../interfaces/Posts";

interface MarketplacePostsState {
  posts: Post[];
  loading: boolean;
  filters: {
    title?: string;
    category1?: string;
    category2?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  };
  setPosts: (posts: Post[]) => void;
  setLoading: (loading: boolean) => void;
  setFilters: (filters: Partial<MarketplacePostsState['filters']>) => void;
  clearFilters: () => void;
  getFilteredPosts: () => Post[];
}

export const useMarketplacePostsStore = create<MarketplacePostsState>((set, get) => ({
  posts: [],
  loading: false,
  filters: {},

  setPosts: (posts) => set({ posts }),
  
  setLoading: (loading) => set({ loading }),
  
  setFilters: (newFilters) => 
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    })),
  
  clearFilters: () => set({ filters: {} }),
  
  getFilteredPosts: () => {
    const { posts, filters } = get();
    
    return posts.filter(post => {
      // Filtro por título
      if (filters.title && !post.title.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
      }
      
      // Filtro por categoría 1
      if (filters.category1 && post.product?.category1 !== filters.category1) {
        return false;
      }
      
      // Filtro por categoría 2
      if (filters.category2 && post.product?.category2 !== filters.category2) {
        return false;
      }
      
      // Filtro por precio mínimo
      if (filters.minPrice && post.price < filters.minPrice) {
        return false;
      }
      
      // Filtro por precio máximo
      if (filters.maxPrice && post.price > filters.maxPrice) {
        return false;
      }
      
      // Filtro por estado
      if (filters.status && post.product?.status !== filters.status) {
        return false;
      }
      
      return true;
    });
  },
}));
