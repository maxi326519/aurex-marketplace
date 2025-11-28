import { PaginationInfo } from "../../../components/Dashboard/Table/Table";
import { Stock, Product } from "../../../interfaces/Product";
import useStockStore from "./useStockStore";
import axios from "axios";
import Swal from "sweetalert2";

export interface ProductWithStock extends Product {
  Stocks?: Stock[];
}

export interface UseStock {
  data: Stock[];
  productsWithStock: ProductWithStock[];
  pagination: PaginationInfo | null;
  loading: {
    get: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    getProducts: boolean;
    getMovements: boolean;
  };
  movements: any[];
  create: (stock: Stock) => Promise<void>;
  get: (includeProduct?: boolean) => Promise<void>;
  getByProduct: (productId: string, includeProduct?: boolean) => Promise<void>;
  getByStorage: (storageId: string) => Promise<void>;
  update: (stock: Stock) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getProductsWithStock: (
    page?: number,
    limit?: number,
    searchTerm?: string,
    status?: string,
    businessId?: string
  ) => Promise<void>;
  getMovementsByProduct: (productId: string) => Promise<void>;
  api: {
    getProductsWithStock: (
      page?: number,
      limit?: number,
      searchTerm?: string,
      status?: string,
      businessId?: string
    ) => Promise<{ data: ProductWithStock[]; pagination: PaginationInfo }>;
    getMovementsByProduct: (productId: string) => Promise<any[]>;
  };
}

export default function useStock(): UseStock {
  const {
    data,
    productsWithStock,
    pagination,
    movements,
    loading,
    setLoading,
    setStocks,
    addStock,
    updateStock: updateStockInStore,
    removeStock,
    setProductsWithStock,
    setPagination,
    setMovements,
  } = useStockStore();

  // API functions
  const postStockAPI = async (stock: Stock): Promise<Stock> => {
    const response = await axios.post("/stock", stock);
    return response.data;
  };

  const getStockAPI = async (includeProduct: boolean = false): Promise<Stock[]> => {
    const params = new URLSearchParams();
    if (includeProduct) {
      params.append("includeProduct", "true");
    }
    const url = params.toString() ? `/stock?${params.toString()}` : "/stock";
    const response = await axios.get(url);
    return response.data;
  };

  const getStockByProduct = async (
    productId: string,
    includeProduct: boolean = false
  ): Promise<Stock[]> => {
    const params = new URLSearchParams();
    if (includeProduct) {
      params.append("includeProduct", "true");
    }
    const url = params.toString()
      ? `/stock/product/${productId}?${params.toString()}`
      : `/stock/product/${productId}`;
    const response = await axios.get(url);
    return response.data;
  };

  const getStockByStorage = async (storageId: string): Promise<Stock[]> => {
    const response = await axios.get(`/stock/storage/${storageId}`);
    return response.data;
  };

  const updateStockAPI = async (stock: Stock): Promise<Stock> => {
    await axios.patch("/stock", stock);
    return stock;
  };

  const deleteStockAPI = async (id: string): Promise<void> => {
    await axios.delete(`/stock/${id}`);
  };

  // API functions for products with stock
  const getProductsWithStockAPI = async (
    page: number = 1,
    limit: number = 10,
    searchTerm?: string,
    status?: string,
    businessId?: string
  ): Promise<{ data: ProductWithStock[]; pagination: PaginationInfo }> => {
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
    if (businessId) {
      params.append("businessId", businessId);
    }
    const response = await axios.get(
      `/products/with-stock?${params.toString()}`
    );
    return response.data;
  };

  // API function for movements by product
  const getMovementsByProductAPI = async (
    productId: string
  ): Promise<any[]> => {
    const response = await axios.get(`/movements/product/${productId}`);
    return response.data;
  };

  async function createStockItem(stock: Stock): Promise<void> {
    setLoading("create", true);
    try {
      const newStock = await postStockAPI(stock);
      addStock(newStock);
      Swal.fire("Created", "Stock created successfully", "success");
    } catch (error: any) {
      console.error(error);
      Swal.fire("Error", "Error to create the stock, try later", "error");
      throw error;
    } finally {
      setLoading("create", false);
    }
  }

  async function getStockData(includeProduct: boolean = false): Promise<void> {
    setLoading("get", true);
    try {
      const stocks = await getStockAPI(includeProduct);
      setStocks(stocks);
    } catch (error: any) {
      console.error(error);
      Swal.fire("Error", "Error to get the stocks, try later", "error");
      throw error;
    } finally {
      setLoading("get", false);
    }
  }

  async function getStockByProductData(
    productId: string,
    includeProduct: boolean = false
  ): Promise<void> {
    setLoading("get", true);
    try {
      const stocks = await getStockByProduct(productId, includeProduct);
      setStocks(stocks);
    } catch (error: any) {
      console.error(error);
      Swal.fire("Error", "Error to get the stocks, try later", "error");
      throw error;
    } finally {
      setLoading("get", false);
    }
  }

  async function getStockByStorageData(storageId: string): Promise<void> {
    setLoading("get", true);
    try {
      const stocks = await getStockByStorage(storageId);
      setStocks(stocks);
    } catch (error: any) {
      console.error(error);
      Swal.fire("Error", "Error to get the stocks, try later", "error");
      throw error;
    } finally {
      setLoading("get", false);
    }
  }

  async function updateStockItem(stock: Stock): Promise<void> {
    setLoading("update", true);
    try {
      await updateStockAPI(stock);
      updateStockInStore(stock);
      Swal.fire("Updated", "Stock updated successfully", "success");
    } catch (error: any) {
      console.error(error);
      Swal.fire("Error", "Error to update the stock, try later", "error");
      throw error;
    } finally {
      setLoading("update", false);
    }
  }

  async function removeStockItem(id: string): Promise<void> {
    const response = await Swal.fire({
      icon: "info",
      text: "Are you sure you want to delete this stock?",
      showCancelButton: true,
      confirmButtonText: "Accept",
      cancelButtonText: "Cancel",
    });

    if (response.isConfirmed) {
      setLoading("delete", true);
      try {
        await deleteStockAPI(id);
        removeStock(id);
        Swal.fire("Deleted", "Stock deleted successfully", "success");
      } catch (error: any) {
        console.error(error);
        Swal.fire("Error", "Error to delete the stock, try later", "error");
        throw error;
      } finally {
        setLoading("delete", false);
      }
    }
  }

  async function getProductsWithStockData(
    page: number = 1,
    limit: number = 10,
    searchTerm?: string,
    status?: string,
    businessId?: string
  ): Promise<void> {
    setLoading("getProducts", true);
    try {
      const response = await getProductsWithStockAPI(
        page,
        limit,
        searchTerm,
        status,
        businessId
      );
      setProductsWithStock(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error(error);
      Swal.fire(
        "Error",
        "Error to get products with stock, try later",
        "error"
      );
      throw error;
    } finally {
      setLoading("getProducts", false);
    }
  }

  async function getMovementsByProductData(productId: string): Promise<void> {
    setLoading("getMovements", true);
    try {
      const movementsData = await getMovementsByProductAPI(productId);
      setMovements(movementsData);
    } catch (error: any) {
      console.error(error);
      Swal.fire("Error", "Error to get movements, try later", "error");
      throw error;
    } finally {
      setLoading("getMovements", false);
    }
  }

  return {
    data,
    productsWithStock,
    pagination,
    movements,
    loading,
    create: createStockItem,
    get: getStockData,
    getByProduct: getStockByProductData,
    getByStorage: getStockByStorageData,
    update: updateStockItem,
    remove: removeStockItem,
    getProductsWithStock: getProductsWithStockData,
    getMovementsByProduct: getMovementsByProductData,
    api: {
      getProductsWithStock: getProductsWithStockAPI,
      getMovementsByProduct: getMovementsByProductAPI,
    },
  };
}
