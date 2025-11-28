import axios, { AxiosError } from "axios";
import { useBusinessStore } from "./useBusinessStore";
import { PaymentOption } from "../../interfaces/PaymentOption";
import { useEffect } from "react";
import { Business } from "../../interfaces/Business";
import { useAuth } from "../Auth/useAuth";

interface UseBusiness {
  business: Business | null;
  paymentOptions: PaymentOption[];
  loading: boolean;
  error: string | null;
  createBusiness: (
    data: Omit<Business, "id" | "averageScore" | "userId">
  ) => Promise<Business>;
  getBusiness: (businessId: string) => Promise<Business>;
  getBusinessByUserId: (userId: string) => Promise<Business>;
  updateBusiness: (
    businessId: string,
    data: Partial<Business>
  ) => Promise<Business>;
  getPaymentOptions: (businessId: string) => Promise<PaymentOption[]>;
  createPaymentOption: (
    data: Omit<PaymentOption, "id" | "createdAt" | "updatedAt">
  ) => Promise<PaymentOption>;
  updatePaymentOption: (
    id: string,
    data: Partial<PaymentOption>
  ) => Promise<PaymentOption>;
  deletePaymentOption: (id: string) => Promise<void>;
  refreshPaymentOptions: () => Promise<void>;
}

export const useBusiness = (): UseBusiness => {
  const { business: authBusiness, user } = useAuth();
  const {
    business,
    paymentOptions,
    loading,
    error,
    setBusiness,
    setPaymentOptions,
    addPaymentOptionToStore,
    updatePaymentOptionInStore,
    removePaymentOptionFromStore,
    setLoading,
    setError,
  } = useBusinessStore();

  // Sincronizar con el business del auth store
  useEffect(() => {
    if (authBusiness) {
      setBusiness(authBusiness);
    }
  }, [authBusiness, setBusiness]);

  const createBusiness = async (
    data: Omit<Business, "id" | "averageScore" | "userId">
  ): Promise<Business> => {
    setLoading(true);
    setError(null);
    try {
      // Mapear los datos del frontend a los nombres esperados por el backend
      const businessData: Business = {
        name: data.name,
        type: data.type,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        UserId: user?.id, // Necesitamos el userId del usuario autenticado
      };

      const response = await axios.post("/business", businessData);
      const newBusiness = response.data;
      setBusiness(newBusiness);
      setError(null);
      return newBusiness;
    } catch (error) {
      console.error("Error creating business:", error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.error ||
            error.message ||
            "Error al crear el negocio"
          : "Error al crear el negocio";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getBusiness = async (businessId: string): Promise<Business> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/business/${businessId}`);
      const businessData = response.data;
      setBusiness(businessData);
      setError(null);
      return businessData;
    } catch (error) {
      console.error("Error getting business:", error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.error ||
            error.message ||
            "Error al obtener el negocio"
          : "Error al obtener el negocio";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getBusinessByUserId = async (userId: string): Promise<Business> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/business/user/${userId}`);
      const businessData = response.data;
      setBusiness(businessData);
      setError(null);
      return businessData;
    } catch (error) {
      console.error("Error getting business by user:", error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.error ||
            error.message ||
            "Error al obtener el negocio del usuario"
          : "Error al obtener el negocio del usuario";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateBusiness = async (
    businessId: string,
    data: Partial<Business>
  ): Promise<Business> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(`/business/${businessId}`, data);
      const updatedBusiness = response.data;
      setBusiness(updatedBusiness);
      setError(null);
      return updatedBusiness;
    } catch (error) {
      console.error("Error updating business:", error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.error ||
            error.message ||
            "Error al actualizar el negocio"
          : "Error al actualizar el negocio";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentOptions = async (
    businessId: string
  ): Promise<PaymentOption[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/payment-options?businessId=${businessId}`
      );
      const options = response.data;
      setPaymentOptions(options);
      setError(null);
      return options;
    } catch (error) {
      console.error("Error getting payment options:", error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.error ||
            error.message ||
            "Error al obtener opciones de pago"
          : "Error al obtener opciones de pago";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createPaymentOption = async (
    data: Omit<PaymentOption, "id" | "createdAt" | "updatedAt">
  ): Promise<PaymentOption> => {
    setLoading(true);
    setError(null);
    try {
      const paymentOptionData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await axios.post("/payment-options", paymentOptionData);
      const newOption = response.data;

      // Actualizar la lista local en el store
      addPaymentOptionToStore(newOption);
      setError(null);

      return newOption;
    } catch (error) {
      console.error("Error creating payment option:", error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.error ||
            error.message ||
            "Error al crear opción de pago"
          : "Error al crear opción de pago";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentOption = async (
    id: string,
    data: Partial<PaymentOption>
  ): Promise<PaymentOption> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/payment-options/${id}`, data);
      const updatedOption = response.data;

      // Actualizar la lista local en el store
      updatePaymentOptionInStore(id, updatedOption);
      setError(null);

      return updatedOption;
    } catch (error) {
      console.error("Error updating payment option:", error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.error ||
            error.message ||
            "Error al actualizar opción de pago"
          : "Error al actualizar opción de pago";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deletePaymentOption = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/payment-options/${id}`);

      // Actualizar la lista local en el store
      removePaymentOptionFromStore(id);
      setError(null);
    } catch (error) {
      console.error("Error deleting payment option:", error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.error ||
            error.message ||
            "Error al eliminar opción de pago"
          : "Error al eliminar opción de pago";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshPaymentOptions = async (): Promise<void> => {
    if (business?.id) {
      await getPaymentOptions(business.id);
    }
  };

  return {
    business,
    paymentOptions,
    loading,
    error,
    createBusiness,
    getBusiness,
    getBusinessByUserId,
    updateBusiness,
    getPaymentOptions,
    createPaymentOption,
    updatePaymentOption,
    deletePaymentOption,
    refreshPaymentOptions,
  };
};
