import { persist } from "zustand/middleware";
import { create } from "zustand";
import { User } from "../../interfaces/Users";
import { Business } from "../../interfaces/Business";

interface AuthState {
  user: User | null;
  business: Business | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  setBusiness: (business: Business | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      business: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
      setBusiness: (business) => set({ business }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),
      logout: () =>
        set({
          user: null,
          business: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        business: state.business,
      }),
    }
  )
);
