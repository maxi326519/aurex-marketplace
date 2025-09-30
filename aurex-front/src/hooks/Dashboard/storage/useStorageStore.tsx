import { Storage } from "../../../interfaces/Storage";
import { create } from "zustand";

interface StorageState {
  data: Storage[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setStorages: (storages: Storage[]) => void;
  addStorage: (storage: Storage) => void;
  updateStorage: (storage: Storage) => void;
  removeStorage: (id: string) => void;
}

// Store de Zustand
const useStorageStore = create<StorageState>((set) => ({
  data: [],
  loading: false,
  setLoading: (loading) => set({ loading }),
  setStorages: (storages) => set({ data: storages }),
  addStorage: (storage) => set((state) => ({ data: [...state.data, storage] })),
  updateStorage: (storage) =>
    set((state) => ({
      data: state.data.map((s) => (s.id === storage.id ? storage : s)),
    })),
  removeStorage: (id) =>
    set((state) => ({
      data: state.data.filter((s) => s.id !== id),
    })),
}));

export default useStorageStore;
