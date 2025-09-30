import { Category, Product } from "../../../interfaces/Product";
import { useProductsStore } from "./useProductStore";
import axios from "axios";
import Swal from "sweetalert2";

export interface UseProducts {
  data: Product[];
  create: (product: Product) => Promise<Product>;
  get: () => Promise<void>;
  update: (product: Product) => Promise<void>;
  remove: (productId: string) => Promise<void>;
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
    setLoading,
    setProducts,
    setCategories,
    addProduct,
    updateProduct,
    removeProduct,
    /*     addCategories,
    removeCategories, */
  } = useProductsStore();

  // Product API functions
  const postProduct = async (product: Product): Promise<Product> => {
    const response = await axios.post("/products", product);
    return response.data;
  };

  const getProducts = async (): Promise<Product[]> => {
    const response = await axios.get("/products");
    return response.data;
  };

  const updateProductAPI = async (product: Product): Promise<Product> => {
    await axios.patch("/products", product);
    return product;
  };

  const deleteProductAPI = async (productId: string): Promise<void> => {
    await axios.delete(`/products/${productId}`);
  };

  // Category API functions
  /*   const postCategory = async (category: Category): Promise<Category> => {
    const response = await axios.post("/categories", category);
    return response.data;
  }; */

  const getCategoriesAPI = async (): Promise<Category[]> => {
    const response = await axios.get("/categories");
    return response.data;
  };

  /*   const deleteCategory = async (categoryId: string): Promise<void> => {
    await axios.delete(`/categories/${categoryId}`);
  }; */

  // Product operations
  async function createProduct(product: Product): Promise<Product> {
    setLoading(true);
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
      setLoading(false);
    }
  }

  async function getAllProducts(): Promise<void> {
    setLoading(true);
    try {
      const products = await getProducts();
      setProducts(products);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to get the products, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateProductById(product: Product): Promise<void> {
    setLoading(true);
    try {
      await updateProductAPI(product);
      updateProduct(product);
      Swal.fire("Updated", "Successfully updated product", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to update the product, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function removeProductById(productId: string): Promise<void> {
    setLoading(true);
    try {
      await deleteProductAPI(productId);
      removeProduct(productId);
      Swal.fire("Deleted", "Successfully deleted product", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to delete the product, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Category operations
  async function getAllCategories(): Promise<void> {
    setLoading(true);
    try {
      const categoriesData = await getCategoriesAPI();
      setCategories(categoriesData);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to get the categories, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateCategoriesItems(/* cache: Cache */): Promise<void> {
    setLoading(true);
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
      setLoading(false);
    }
  }

  return {
    data,
    create: createProduct,
    get: getAllProducts,
    update: updateProductById,
    remove: removeProductById,
    categories: {
      data: categories,
      get: getAllCategories,
      update: updateCategoriesItems,
    },
  };
}
