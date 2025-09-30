import { create } from "zustand";
import { User } from "../../../interfaces/Users";

interface UsersState {
  data: User[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  removeUser: (userId: string) => void;
}

// Store de Zustand
const useSellersStore = create<UsersState>((set) => ({
  data: [],
  loading: false,
  setLoading: (loading) => set({ loading }),
  setUsers: (users) => set({ data: users }),
  addUser: (user) => set((state) => ({ data: [...state.data, user] })),
  updateUser: (user) =>
    set((state) => ({
      data: state.data.map((u) => (u.id === user.id ? user : u)),
    })),
  removeUser: (userId) =>
    set((state) => ({
      data: state.data.filter((u) => u.id !== userId),
    })),
}));

export default useSellersStore;
