import { MovementOrder } from "../../../interfaces/MovementOrders";
import { create } from "zustand";

interface MovementOrdersState {
  pendings: MovementOrder[];
  approved: MovementOrder[];
  history: MovementOrder[];
  setMovementOrders: (movementOrders: MovementOrder[], key: Keys) => void;
  addMovementOrder: (movementOrder: MovementOrder, key: Keys) => void;
  updateMovementOrder: (movementOrder: MovementOrder, key: Keys) => void;
  removeMovementOrder: (movementOrderId: string, key: Keys) => void;
}

export type Keys = "pendings" | "approved" | "history";

export const useMovementOrdersStore = create<MovementOrdersState>((set) => ({
  pendings: [],
  approved: [],
  history: [],
  setMovementOrders: (movementOrders, key) => set({ [key]: movementOrders }),
  addMovementOrder: (movementOrder, key) =>
    set((state) => ({
      [key]: [...state[key], movementOrder],
    })),
  updateMovementOrder: (movementOrder, key) =>
    set((state) => ({
      [key]: state[key].map((m) => (m.id === movementOrder.id ? movementOrder : m)),
    })),
  removeMovementOrder: (movementOrderId, key) =>
    set((state) => ({
      [key]: state[key].filter((m) => m.id !== movementOrderId),
    })),
}));

