import { Reception } from "../../../interfaces/Receptions";
import { create } from "zustand";

interface ReceptionsState {
  pendings: Reception[];
  approved: Reception[];
  history: Reception[];
  setReceptions: (receptions: Reception[], key: Keys) => void;
  addReception: (reception: Reception, key: Keys) => void;
  updateReception: (reception: Reception, key: Keys) => void;
  removeReception: (receptionId: string, key: Keys) => void;
}

export type Keys = "pendings" | "approved" | "history";

export const useReceptionsStore = create<ReceptionsState>((set) => ({
  pendings: [],
  approved: [],
  history: [],
  setReceptions: (receptions, key) => set({ [key]: receptions }),
  addReception: (reception, key) =>
    set((state) => ({
      [key]: [...state[key], reception],
    })),
  updateReception: (reception, key) =>
    set((state) => ({
      [key]: state[key].map((r) => (r.id === reception.id ? reception : r)),
    })),
  removeReception: (receptionId, key) =>
    set((state) => ({
      [key]: state[key].filter((r) => r.id !== receptionId),
    })),
}));
