import axios, { AxiosError } from "axios";
import { useAuthStore } from "./useAuthStore";
import { Business } from "../../interfaces/Business";
import {
  LoginData,
  User,
  UserRol,
  CompradorRegistrationData,
} from "../../interfaces/Users";
import Swal from "sweetalert2";

interface PaymentOption {
  id: string;
  userId: string;
  type: "link" | "transferencia";
  link?: string;
  pasarela?: string;
  cvu?: string;
  cbu?: string;
  otrosDatos?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseAuth {
  user: User | null;
  business: Business | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  register: (
    email: string,
    password: string,
    role: UserRol
  ) => Promise<User | undefined>;
  completeCompradorRegistration: (
    registrationData: CompradorRegistrationData
  ) => Promise<User | undefined>;
  completeVendedorRegistration: (
    userData: User,
    businessData: Business
  ) => Promise<void>;
  login: (loginData: LoginData) => Promise<User | undefined>;
  logout: () => Promise<void>;
  reLogin: () => Promise<void>;
  getPaymentOptions: (userId: string) => Promise<PaymentOption[]>;
  createPaymentOption: (
    data: Omit<PaymentOption, "id" | "createdAt" | "updatedAt">
  ) => Promise<PaymentOption>;
  updatePaymentOption: (
    id: string,
    data: Partial<PaymentOption>
  ) => Promise<PaymentOption>;
  deletePaymentOption: (id: string) => Promise<void>;
}

export const useAuth = (): UseAuth => {
  const {
    user,
    business,
    token,
    isAuthenticated,
    loading,
    setUser,
    setBusiness,
    setToken,
    setLoading,
    logout: logoutStore,
  } = useAuthStore();

  const configureAxiosInterceptor = (token: string) => {
    axios.interceptors.request.clear();
    axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  };

  const register = async (
    email: string,
    password: string,
    role: UserRol
  ): Promise<User | undefined> => {
    try {
      const response = await axios.post("/sesion/signup", {
        email,
        password,
        role,
      });
      if (!response.data?.user) throw new Error("Error to create user");

      await login({ email, password });

      return response.data.user;
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof AxiosError) {
        throw new Error(
          error?.response?.data?.error || error.message || "Login failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const completeCompradorRegistration = async (
    registrationData: CompradorRegistrationData
  ): Promise<User | undefined> => {
    setLoading(true);
    try {
      const response = await axios.put("/sesion/complete-registration", {
        ...registrationData,
        rol: UserRol.CLIENT,
      });

      if (!response.data?.user) throw new Error("Error al completar registro");

      // Actualizar el usuario en el store
      setUser({ ...response.data.user, token });

      return response.data.user;
    } catch (error) {
      console.error("Error al completar registro de comprador:", error);
      if (error instanceof AxiosError) {
        throw new Error(
          error?.response?.data?.error ||
            error.message ||
            "Error al completar registro"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const completeVendedorRegistration = async (
    userData: User,
    businessData: Business
  ): Promise<void> => {
    setLoading(true);
    try {
      // Complete profiel and Business data
      const response = await axios.put("/sesion/complete-registration", {
        userData,
        businessData,
      });
      if (!response.data?.user || !response.data?.business)
        throw new Error("Error al completar registro");

      // Update local store
      setUser({ ...response.data.user, token });
      setBusiness(response.data.business);
    } catch (error) {
      console.error("Error to complete registration", error);
      if (error instanceof AxiosError) {
        throw new Error(
          error?.response?.data?.error ||
            error.message ||
            "Error al completar registro"
        );
      }
      Swal.fire("Error", "Error al completar registro", "error");
    } finally {
      setLoading(false);
    }
  };

  const login = async (loginData: LoginData): Promise<User | undefined> => {
    setLoading(true);
    try {
      // Login
      const response = await axios.post("/sesion/login", loginData);

      // Get TOKEN and user
      const userData = response.data.user;
      const token = response.data.token;

      if (!userData) throw new Error("User not found");
      if (!token) throw new Error("Token error");

      // Configure axios interceptor
      configureAxiosInterceptor(token);

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Update store
      setUser({ ...userData, token });
      setToken(token);

      return userData;
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof AxiosError) {
        throw new Error(
          error?.response?.data?.error || error.message || "Login failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      // Clear localStorage
      localStorage.removeItem("token");

      // Clear axios interceptors
      axios.interceptors.request.clear();

      // Update store
      logoutStore();
    } catch (error) {
      console.error("Logout error:", error);
      if (error instanceof AxiosError) {
        throw new Error(
          error?.response?.data?.error || error.message || "Logout failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const reLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Check token
      if (token) {
        // Configure axios interceptor
        configureAxiosInterceptor(token);

        // Login with token
        const response = await axios.post("/sesion/token");

        // Update store
        setUser({ ...response.data, token });
        setToken(token);
      }
    } catch (error) {
      console.error("Relogin error:", error);

      // Clear invalid token
      localStorage.removeItem("token");
      logoutStore();

      if (error instanceof AxiosError) {
        throw new Error(
          error?.response?.data?.error || error.message || "Session expired"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getPaymentOptions = async (
    userId: string
  ): Promise<PaymentOption[]> => {
    try {
      const response = await axios.get(`/payment-options?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting payment options:", error);
      throw error;
    }
  };

  const createPaymentOption = async (
    data: Omit<PaymentOption, "id" | "createdAt" | "updatedAt">
  ): Promise<PaymentOption> => {
    try {
      const response = await axios.post("/payment-options", data);
      return response.data;
    } catch (error) {
      console.error("Error creating payment option:", error);
      throw error;
    }
  };

  const updatePaymentOption = async (
    id: string,
    data: Partial<PaymentOption>
  ): Promise<PaymentOption> => {
    try {
      const response = await axios.put(`/payment-options/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating payment option:", error);
      throw error;
    }
  };

  const deletePaymentOption = async (id: string): Promise<void> => {
    try {
      await axios.delete(`/payment-options/${id}`);
    } catch (error) {
      console.error("Error deleting payment option:", error);
      throw error;
    }
  };

  return {
    user,
    business,
    token,
    isAuthenticated,
    loading,
    register,
    completeCompradorRegistration,
    completeVendedorRegistration,
    login,
    logout,
    reLogin,
    getPaymentOptions,
    createPaymentOption,
    updatePaymentOption,
    deletePaymentOption,
  };
};
