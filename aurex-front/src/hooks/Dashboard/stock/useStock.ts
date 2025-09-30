import { Stock } from "../../../interfaces/Product";
import useStockStore from "./useStockStore";
import axios from "axios";
import Swal from "sweetalert2";

export interface UseStock {
  data: Stock[];
  create: (stock: Stock) => Promise<void>;
  get: () => Promise<void>;
  getByProduct: (productId: string) => Promise<void>;
  update: (stock: Stock) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export default function useStock(): UseStock {
  const {
    data,
    setLoading,
    setStocks,
    addStock,
    updateStock: updateStockInStore,
    removeStock,
  } = useStockStore();

  // API functions
  const postStockAPI = async (stock: Stock): Promise<Stock> => {
    const response = await axios.post("/stock", stock);
    return response.data;
  };

  const getStockAPI = async (): Promise<Stock[]> => {
    const response = await axios.get("/stock");
    return response.data;
  };

  const getStockByProduct = async (productId: string): Promise<Stock[]> => {
    const response = await axios.get(`/stock/${productId}`);
    return response.data;
  };

  const updateStockAPI = async (stock: Stock): Promise<Stock> => {
    await axios.patch("/stock", stock);
    return stock;
  };

  const deleteStockAPI = async (id: string): Promise<void> => {
    await axios.delete(`/stock/${id}`);
  };

  async function createStockItem(stock: Stock): Promise<void> {
    setLoading(true);
    try {
      const newStock = await postStockAPI(stock);
      addStock(newStock);
      Swal.fire("Created", "Stock created successfully", "success");
    } catch (error: any) {
      console.error(error);
      Swal.fire("Error", "Error to create the stock, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getStockData(): Promise<void> {
    setLoading(true);
    try {
      const stocks = await getStockAPI();
      setStocks(stocks);
    } catch (error: any) {
      console.error(error);
      Swal.fire("Error", "Error to get the stocks, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getStockByProductData(productId: string): Promise<void> {
    setLoading(true);
    try {
      const stocks = await getStockByProduct(productId);
      setStocks(stocks);
    } catch (error: any) {
      console.error(error);
      Swal.fire("Error", "Error to get the stocks, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateStockItem(stock: Stock): Promise<void> {
    setLoading(true);
    try {
      await updateStockAPI(stock);
      updateStockInStore(stock);
      Swal.fire("Updated", "Stock updated successfully", "success");
    } catch (error: any) {
      console.error(error);
      Swal.fire("Error", "Error to update the stock, try later", "error");
      throw error;
    } finally {
      setLoading(false);
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
      setLoading(true);
      try {
        await deleteStockAPI(id);
        removeStock(id);
        Swal.fire("Deleted", "Stock deleted successfully", "success");
      } catch (error: any) {
        console.error(error);
        Swal.fire("Error", "Error to delete the stock, try later", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    }
  }

  return {
    data,
    create: createStockItem,
    get: getStockData,
    getByProduct: getStockByProductData,
    update: updateStockItem,
    remove: removeStockItem,
  };
}
