import { useMarketplacePostsStore } from "./useMarketplacePosts";
import { Post } from "../../interfaces/Posts";
import axios from "axios";
import Swal from "sweetalert2";

export interface UseMarketplacePosts {
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
  filteredPosts: Post[];
  getPosts: () => Promise<void>;
  getPostsWithFilters: (filters?: any) => Promise<void>;
  setFilters: (filters: Partial<UseMarketplacePosts['filters']>) => void;
  clearFilters: () => void;
  searchPosts: (query: string) => void;
}

export default function useMarketplacePosts(): UseMarketplacePosts {
  const {
    posts,
    loading,
    filters,
    setPosts,
    setLoading,
    setFilters,
    clearFilters,
    getFilteredPosts,
  } = useMarketplacePostsStore();

  // API functions
  const fetchPosts = async (): Promise<Post[]> => {
    const response = await axios.get("/posts?marketplace=true");
    return response.data;
  };

  const fetchPostsWithFilters = async (queryFilters: any): Promise<Post[]> => {
    const params = new URLSearchParams();
    
    if (queryFilters.title) params.append('title', queryFilters.title);
    if (queryFilters.category1) params.append('category1', queryFilters.category1);
    if (queryFilters.category2) params.append('category2', queryFilters.category2);
    if (queryFilters.minPrice) params.append('minPrice', queryFilters.minPrice.toString());
    if (queryFilters.maxPrice) params.append('maxPrice', queryFilters.maxPrice.toString());
    if (queryFilters.status) params.append('status', queryFilters.status);
    
    params.append('marketplace', 'true');
    
    const response = await axios.get(`/posts?${params.toString()}`);
    return response.data;
  };

  // Operations
  const getPosts = async (): Promise<void> => {
    try {
      setLoading(true);
      const postsData = await fetchPosts();
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
      Swal.fire("Error", "Error al cargar las publicaciones", "error");
    } finally {
      setLoading(false);
    }
  };

  const getPostsWithFilters = async (queryFilters?: any): Promise<void> => {
    try {
      setLoading(true);
      const postsData = queryFilters 
        ? await fetchPostsWithFilters(queryFilters)
        : await fetchPosts();
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts with filters:", error);
      Swal.fire("Error", "Error al cargar las publicaciones filtradas", "error");
    } finally {
      setLoading(false);
    }
  };

  const searchPosts = (query: string): void => {
    setFilters({ title: query });
  };

  return {
    posts,
    loading,
    filters,
    filteredPosts: getFilteredPosts(),
    getPosts,
    getPostsWithFilters,
    setFilters,
    clearFilters,
    searchPosts,
  };
}
