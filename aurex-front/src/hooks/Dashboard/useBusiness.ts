import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Business } from "../../interfaces/Business";
import { PaymentOption } from "../../interfaces/PaymentOption";
import { useAuth } from "../Auth/useAuth";

interface UseBusiness {
  business: Business | null;
  paymentOptions: PaymentOption[];
  loading: boolean;
  error: string | null;
  createBusiness: (data: Omit<Business, 'id' | 'averageScore' | 'userId'>) => Promise<Business>;
  getBusiness: (businessId: string) => Promise<Business>;
  updateBusiness: (businessId: string, data: Partial<Business>) => Promise<Business>;
  getPaymentOptions: (businessId: string) => Promise<PaymentOption[]>;
  createPaymentOption: (data: Omit<PaymentOption, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PaymentOption>;
  updatePaymentOption: (id: string, data: Partial<PaymentOption>) => Promise<PaymentOption>;
  deletePaymentOption: (id: string) => Promise<void>;
  refreshPaymentOptions: () => Promise<void>;
}

export const useBusiness = (): UseBusiness => {
  const { business: authBusiness, user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(authBusiness);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar con el business del auth store
  useEffect(() => {
    setBusiness(authBusiness);
  }, [authBusiness]);

  const createBusiness = async (data: Omit<Business, 'id' | 'averageScore' | 'userId'>): Promise<Business> => {
    setLoading(true);
    setError(null);
    try {
      // Mapear los datos del frontend a los nombres esperados por el backend
      const businessData = {
        businessName: data.name,
        businessType: data.type,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        taxId: data.taxId,
        bankAccount: data.bankAccount,
        userId: user?.id, // Necesitamos el userId del usuario autenticado
      };

      const response = await axios.post("/business", businessData);
      const newBusiness = response.data;
      setBusiness(newBusiness);
      return newBusiness;
    } catch (error) {
      console.error("Error creating business:", error);
      const errorMessage = error instanceof AxiosError 
        ? error?.response?.data?.error || error.message || "Error al crear el negocio"
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
      return businessData;
    } catch (error) {
      console.error("Error getting business:", error);
      const errorMessage = error instanceof AxiosError 
        ? error?.response?.data?.error || error.message || "Error al obtener el negocio"
        : "Error al obtener el negocio";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateBusiness = async (businessId: string, data: Partial<Business>): Promise<Business> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/business/${businessId}`, data);
      const updatedBusiness = response.data;
      setBusiness(updatedBusiness);
      return updatedBusiness;
    } catch (error) {
      console.error("Error updating business:", error);
      const errorMessage = error instanceof AxiosError 
        ? error?.response?.data?.error || error.message || "Error al actualizar el negocio"
        : "Error al actualizar el negocio";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentOptions = async (businessId: string): Promise<PaymentOption[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/payment-options?businessId=${businessId}`);
      const options = response.data;
      setPaymentOptions(options);
      return options;
    } catch (error) {
      console.error("Error getting payment options:", error);
      const errorMessage = error instanceof AxiosError 
        ? error?.response?.data?.error || error.message || "Error al obtener opciones de pago"
        : "Error al obtener opciones de pago";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createPaymentOption = async (data: Omit<PaymentOption, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentOption> => {
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
      
      // Actualizar la lista local
      setPaymentOptions(prev => [...prev, newOption]);
      
      return newOption;
    } catch (error) {
      console.error("Error creating payment option:", error);
      const errorMessage = error instanceof AxiosError 
        ? error?.response?.data?.error || error.message || "Error al crear opción de pago"
        : "Error al crear opción de pago";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentOption = async (id: string, data: Partial<PaymentOption>): Promise<PaymentOption> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/payment-options/${id}`, data);
      const updatedOption = response.data;
      
      // Actualizar la lista local
      setPaymentOptions(prev => 
        prev.map(option => option.id === id ? updatedOption : option)
      );
      
      return updatedOption;
    } catch (error) {
      console.error("Error updating payment option:", error);
      const errorMessage = error instanceof AxiosError 
        ? error?.response?.data?.error || error.message || "Error al actualizar opción de pago"
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
      
      // Actualizar la lista local
      setPaymentOptions(prev => prev.filter(option => option.id !== id));
    } catch (error) {
      console.error("Error deleting payment option:", error);
      const errorMessage = error instanceof AxiosError 
        ? error?.response?.data?.error || error.message || "Error al eliminar opción de pago"
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
    updateBusiness,
    getPaymentOptions,
    createPaymentOption,
    updatePaymentOption,
    deletePaymentOption,
    refreshPaymentOptions,
  };
};
