import { useOrdersStore } from "./useOrdersStore";
import { useEffect } from "react";
import { Order } from "../../../interfaces/Orders";
import axios from "axios";
import Swal from "sweetalert2";

export interface UseOrders {
  data: Order[];
  create: (order: Order) => Promise<Order>;
  get: () => Promise<void>;
  update: (order: Order) => Promise<void>;
  remove: (orderId: string) => Promise<void>;
}

export default function useOrders(): UseOrders {
  const {
    data,
    setOrders,
    addOrder,
    updateOrder,
    removeOrder,
  } = useOrdersStore();

  useEffect(() => {
    console.log("Ordenes", data);
  }, [data]);

  // Order API functions
  const postOrder = async (order: Order): Promise<Order> => {
    const response = await axios.post("/orders", order);
    return response.data;
  };

  const getOrders = async (): Promise<Order[]> => {
    const response = await axios.get("/orders");
    if (!response.data.orders || !Array.isArray(response.data.orders))
      throw new Error("Error to get orders");

    console.log(response.data.orders);
    return response.data.orders;
  };

  const updateOrderAPI = async (order: Order): Promise<Order> => {
    await axios.patch("/orders", order);
    return order;
  };

  const deleteOrderAPI = async (orderId: string): Promise<void> => {
    await axios.delete(`/orders/${orderId}`);
  };

  // Order operations
  async function createOrder(order: Order): Promise<Order> {
    try {
      const newOrder = await postOrder(order);
      addOrder(newOrder);
      Swal.fire("Created", "Successfully created order", "success");
      return newOrder;
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to create the order, try later", "error");
      throw error;
    }
  }

  async function getAllOrders(): Promise<void> {
    try {
      const orders = await getOrders();
      setOrders(orders);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to get the orders, try later", "error");
      throw error;
    }
  }

  async function updateOrderById(order: Order): Promise<void> {
    try {
      await updateOrderAPI(order);
      updateOrder(order);
      Swal.fire("Updated", "Successfully updated order", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to update the order, try later", "error");
      throw error;
    }
  }

  async function removeOrderById(orderId: string): Promise<void> {
    try {
      await deleteOrderAPI(orderId);
      removeOrder(orderId);
      Swal.fire("Deleted", "Successfully deleted order", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to delete the order, try later", "error");
      throw error;
    }
  }

  return {
    data,
    create: createOrder,
    get: getAllOrders,
    update: updateOrderById,
    remove: removeOrderById,
  };
}
