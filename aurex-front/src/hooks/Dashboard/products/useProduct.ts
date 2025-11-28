import { Category, Product } from "../../../interfaces/Product";
import { useProductsStore } from "./useProductStore";
import { PaginationInfo } from "../../../components/Dashboard/Table/Table";
import { useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export interface UseProducts {
  data: Product[];
  pagination: PaginationInfo | null;
  loading: {
    get: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    search: boolean;
  };
  search: string;
  filters: {
    status: string;
  };
  create: (product: Product) => Promise<Product>;
  get: (page?: number, limit?: number, searchTerm?: string, status?: string) => Promise<void>;
  update: (product: Product) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  searchProducts: (searchTerm: string) => void;
  onFilterChange: (filters: { status: string }) => void;
  onFilterApply: () => void;
  onFilterReset: () => void;
  api: {
    postProduct: (product: Product) => Promise<Product>;
    getProducts: (page?: number, limit?: number, searchTerm?: string, status?: string) => Promise<{ data: Product[]; pagination: PaginationInfo }>;
    updateProduct: (product: Product) => Promise<Product>;
    deleteProduct: (productId: string) => Promise<void>;
    validateProducts: (products: Array<{ ean: string; sku: string }>, businessId?: string) => Promise<Array<{ ean: string; sku: string; exists: boolean; product: Product | null }>>;
  };
  categories: {
    data: Category[];
    get: () => Promise<void>;
    update: (cache: Cache) => Promise<void>;
  };
}

export default function useProducts(): UseProducts {
  const {
    data,
    categories,
    pagination,
    loading,
    search,
    filters,
    setLoading,
    setProducts,
    setCategories,
    setPagination,
    setSearch,
    setFilters,
    addProduct,
    updateProduct,
    removeProduct,
    /*     addCategories,
    removeCategories, */
  } = useProductsStore();

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Product API functions
  const postProduct = async (product: Product): Promise<Product> => {
    const response = await axios.post("/products", product);
    return response.data;
  };

  const getProducts = async (
    page: number = 1,
    limit: number = 10,
    searchTerm?: string,
    status?: string
  ): Promise<{ data: Product[]; pagination: PaginationInfo }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (searchTerm) {
      params.append("search", searchTerm);
    }
    if (status) {
      params.append("status", status);
    }
    const response = await axios.get(`/products?${params.toString()}`);
    return response.data;
  };

  const updateProductAPI = async (product: Product): Promise<Product> => {
    await axios.patch("/products", product);
    return product;
  };

  const deleteProductAPI = async (productId: string): Promise<void> => {
    await axios.delete(`/products/${productId}`);
  };

  const getCategoriesAPI = async (): Promise<Category[]> => {
    const response = await axios.get("/categories");
    return response.data;
  };

  const validateProductsAPI = async (
    products: Array<{ ean: string; sku: string }>,
    businessId?: string
  ): Promise<Array<{ ean: string; sku: string; exists: boolean; product: Product | null }>> => {
    const response = await axios.post("/products/validate", { products, businessId });
    return response.data;
  };

  // Product operations
  async function createProduct(product: Product): Promise<Product> {
    setLoading("create", true);
    try {
      const newProduct = await postProduct(product);
      addProduct(newProduct);
      Swal.fire("Created", "Successfully created product", "success");
      return newProduct;
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to create the product, try later", "error");
      throw error;
    } finally {
      setLoading("create", false);
    }
  }

  async function getAllProducts(
    page: number = 1,
    limit: number = 10,
    searchTerm?: string,
    status?: string
  ): Promise<void> {
    setLoading("get", true);
    try {
      const response = await getProducts(page, limit, searchTerm, status);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to get the products, try later", "error");
      throw error;
    } finally {
      setLoading("get", false);
    }
  }

  function searchProducts(searchTerm: string): void {
    setSearch(searchTerm);
    setLoading("search", true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await getProducts(1, 10, searchTerm, filters.status);
        setProducts(response.data);
        setPagination(response.pagination);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Error to search products, try later", "error");
      } finally {
        setLoading("search", false);
      }
    }, 1000);
  }

  function onFilterChange(newFilters: { status: string }): void {
    setFilters(newFilters);
  }

  function onFilterApply(): void {
    setLoading("get", true);
    getProducts(1, 10, search, filters.status)
      .then((response) => {
        setProducts(response.data);
        setPagination(response.pagination);
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Error", "Error to apply filters, try later", "error");
      })
      .finally(() => {
        setLoading("get", false);
      });
  }

  function onFilterReset(): void {
    setFilters({ status: "" });
    setLoading("get", true);
    getProducts(1, 10, search, "")
      .then((response) => {
        setProducts(response.data);
        setPagination(response.pagination);
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Error", "Error to reset filters, try later", "error");
      })
      .finally(() => {
        setLoading("get", false);
      });
  }

  async function updateProductById(product: Product): Promise<void> {
    setLoading("update", true);
    try {
      await updateProductAPI(product);
      updateProduct(product);
      Swal.fire("Updated", "Successfully updated product", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to update the product, try later", "error");
      throw error;
    } finally {
      setLoading("update", false);
    }
  }

  async function removeProductById(productId: string): Promise<void> {
    setLoading("delete", true);
    try {
      await deleteProductAPI(productId);
      removeProduct(productId);
      Swal.fire("Deleted", "Successfully deleted product", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to delete the product, try later", "error");
      throw error;
    } finally {
      setLoading("delete", false);
    }
  }

  // Category operations
  async function getAllCategories(): Promise<void> {
    setLoading("get", true);
    try {
      const categoriesData = await getCategoriesAPI();
      setCategories(categoriesData);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to get the categories, try later", "error");
      throw error;
    } finally {
      setLoading("get", false);
    }
  }

  async function updateCategoriesItems(/* cache: Cache */): Promise<void> {
    setLoading("update", true);
    try {
      // Add new categories
      // const newCategoriesPromises = cache.new.map((cat) => postCategory(cat));
      // const newCategories = await Promise.all(newCategoriesPromises);

      // Remove categories
      // const removePromises = cache.remove.map((cat) => deleteCategory(cat.id));
      // await Promise.all(removePromises);

      // Update store
      // addCategories(newCategories);
      // removeCategories(cache.remove.map((cat) => cat.id));

      Swal.fire("Updated", "Successfully updated categories", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to update the categories, try later", "error");
      throw error;
    } finally {
      setLoading("update", false);
    }
  }

  return {
    data,
    pagination,
    loading,
    search,
    filters,
    create: createProduct,
    get: getAllProducts,
    update: updateProductById,
    remove: removeProductById,
    searchProducts,
    onFilterChange,
    onFilterApply,
    onFilterReset,
    api: {
      postProduct,
      getProducts,
      updateProduct: updateProductAPI,
      deleteProduct: deleteProductAPI,
      validateProducts: validateProductsAPI,
    },
    categories: {
      data: categories,
      get: getAllCategories,
      update: updateCategoriesItems,
    },
  };
}
