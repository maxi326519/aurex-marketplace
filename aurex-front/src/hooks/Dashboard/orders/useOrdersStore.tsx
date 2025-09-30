import { create } from "zustand";
import { Order } from "../../../interfaces/Orders";

interface OrdersState {
  data: Order[];
  loading: boolean;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  removeOrder: (orderId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  data: [],
  loading: false,
  setOrders: (orders) => set({ data: orders }),
  addOrder: (order) =>
    set((state) => ({
      data: [...state.data, order],
    })),
  updateOrder: (order) =>
    set((state) => ({
      data: state.data.map((o) => (o.id === order.id ? order : o)),
    })),
  removeOrder: (orderId) =>
    set((state) => ({
      data: state.data.filter((o) => o.id !== orderId),
    })),
  setLoading: (loading) => set({ loading }),
}));
