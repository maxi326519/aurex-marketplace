import { useState } from "react";
import {
  OrderManagement,
  PickOrderRequest,
  ScanProductRequest,
  EgressOrderRequest,
} from "../../../interfaces/OrderManagement";
import { OrdersStatus } from "../../../interfaces/Orders";
import useOrders from "./useOrders";
import { useOrdersStore } from "./useOrdersStore";
import { usePDF } from "../../PDF/usePdf";
import axios from "axios";
import Swal from "sweetalert2";

export interface UseOrderManagement {
  orders: OrderManagement[];
  loading: boolean;
  selectedOrder: OrderManagement | null;
  getOrders: () => Promise<void>;
  getOrdersByStatus: (status: OrdersStatus) => Promise<void>;
  pickOrder: (request: PickOrderRequest) => Promise<void>;
  scanProduct: (request: ScanProductRequest) => Promise<boolean>;
  egressOrder: (request: EgressOrderRequest) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  reimprintLabel: (orderId: string) => Promise<void>;
  setSelectedOrder: (order: OrderManagement | null) => void;
}

export default function useOrderManagement(): UseOrderManagement {
  const { data: orders, get: getOrdersFromHook } = useOrders();
  const { loading } = useOrdersStore();
  const [selectedOrder, setSelectedOrder] = useState<OrderManagement | null>(null);

  // API functions for specific order management operations

  const pickOrderAPI = async (request: PickOrderRequest): Promise<void> => {
    await axios.post(`/orders/${request.orderId}/pick`, request);
  };

  const scanProductAPI = async (
    request: ScanProductRequest
  ): Promise<boolean> => {
    const response = await axios.post(
      `/orders/${request.orderId}/scan`,
      request
    );
    return response.data.valid;
  };

  const egressOrderAPI = async (request: EgressOrderRequest): Promise<void> => {
    await axios.post(`/orders/${request.orderId}/egress`, request);
  };

  const cancelOrderAPI = async (orderId: string): Promise<void> => {
    await axios.post(`/orders/${orderId}/cancel`);
  };

  const reimprintLabelAPI = async (order: OrderManagement): Promise<void> => {
    const { openShippingTicketPDF } = usePDF();
    await openShippingTicketPDF(order);
  };

  // Operations - delegating to useOrders hook
  const getOrders = async (): Promise<void> => {
    await getOrdersFromHook();
  };

  const getOrdersByStatus = async (_status: OrdersStatus): Promise<void> => {
    // For now, we'll get all orders and filter on the frontend
    // In the future, this could be enhanced to use a specific API endpoint
    await getOrdersFromHook();
  };

  const pickOrder = async (request: PickOrderRequest): Promise<void> => {
    try {
      await pickOrderAPI(request);
      Swal.fire("Éxito", "Pedido marcado como pickeado", "success");
      await getOrdersFromHook(); // Refresh orders using useOrders hook
    } catch (error) {
      console.error("Error picking order:", error);
      Swal.fire("Error", "Error al pickear el pedido", "error");
    }
  };

  const scanProduct = async (request: ScanProductRequest): Promise<boolean> => {
    try {
      const isValid = await scanProductAPI(request);
      if (isValid) {
        Swal.fire("Éxito", "EAN validado correctamente", "success");
      } else {
        Swal.fire("Error", "EAN no válido para este producto", "error");
      }
      return isValid;
    } catch (error) {
      console.error("Error scanning product:", error);
      Swal.fire("Error", "Error al validar el EAN", "error");
      return false;
    }
  };

  const egressOrder = async (request: EgressOrderRequest): Promise<void> => {
    try {
      await egressOrderAPI(request);
      Swal.fire("Éxito", "Pedido marcado como preparado", "success");
      await getOrdersFromHook(); // Refresh orders using useOrders hook
    } catch (error) {
      console.error("Error egressing order:", error);
      Swal.fire("Error", "Error al preparar el pedido", "error");
    }
  };

  const cancelOrder = async (orderId: string): Promise<void> => {
    try {
      await cancelOrderAPI(orderId);
      Swal.fire("Éxito", "Pedido cancelado", "success");
      await getOrdersFromHook(); // Refresh orders using useOrders hook
    } catch (error) {
      console.error("Error canceling order:", error);
      Swal.fire("Error", "Error al cancelar el pedido", "error");
    }
  };

  const reimprintLabel = async (orderId: string): Promise<void> => {
    try {
      const order = orders.find(o => o.id === orderId) as OrderManagement;
      if (!order) {
        throw new Error("Order not found");
      }
      await reimprintLabelAPI(order);
      Swal.fire("Éxito", "Ticket de envío generado", "success");
    } catch (error) {
      console.error("Error generating shipping ticket:", error);
      Swal.fire("Error", "Error al generar el ticket de envío", "error");
    }
  };

  return {
    orders: orders as OrderManagement[],
    loading,
    selectedOrder,
    getOrders,
    getOrdersByStatus,
    pickOrder,
    scanProduct,
    egressOrder,
    cancelOrder,
    reimprintLabel,
    setSelectedOrder,
  };
}
