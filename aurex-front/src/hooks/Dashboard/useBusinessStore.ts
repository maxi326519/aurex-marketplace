import { create } from "zustand";
import { Business } from "../../interfaces/Business";
import { PaymentOption } from "../../interfaces/PaymentOption";

interface BusinessState {
  business: Business | null;
  paymentOptions: PaymentOption[];
  loading: boolean;
  error: string | null;
  setBusiness: (business: Business | null) => void;
  setPaymentOptions: (paymentOptions: PaymentOption[]) => void;
  addPaymentOptionToStore: (option: PaymentOption) => void;
  updatePaymentOptionInStore: (id: string, option: PaymentOption) => void;
  removePaymentOptionFromStore: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearBusiness: () => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  business: null,
  paymentOptions: [],
  loading: false,
  error: null,
  setBusiness: (business) => set({ business }),
  setPaymentOptions: (paymentOptions) => set({ paymentOptions }),
  addPaymentOptionToStore: (option) =>
    set((state) => ({
      paymentOptions: [...state.paymentOptions, option],
    })),
  updatePaymentOptionInStore: (id, option) =>
    set((state) => ({
      paymentOptions: state.paymentOptions.map((opt) =>
        opt.id === id ? option : opt
      ),
    })),
  removePaymentOptionFromStore: (id) =>
    set((state) => ({
      paymentOptions: state.paymentOptions.filter((opt) => opt.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearBusiness: () =>
    set({
      business: null,
      paymentOptions: [],
      loading: false,
      error: null,
    }),
}));

