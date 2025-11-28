import { useState, useEffect } from "react";
import { useAuthStore } from "../../../hooks/Auth/useAuthStore";
import { useBusiness } from "../../../hooks/Dashboard/useBusiness";
import { Business } from "../../../interfaces/Business";
import { useAuth } from "../../../hooks/Auth/useAuth";
import {
  UserRol,
  UserStatus,
  User as UserInterface,
} from "../../../interfaces/Users";
import axios from "axios";
import Swal from "sweetalert2";

import DashboardLayout from "../../../components/Dashboard/SellerDashboard";
import UserProfile from "../../../components/Dashboard/profile/UserProfile";
import SellerProfileForm from "../../../components/Dashboard/profile/SellerProfileForm";
import PaymentOptionsForm from "../../../components/Dashboard/profile/PaymentOptionsForm";

export interface User {
  id?: string;
  name: string;
  email: string;
  photo: string;
  rol: UserRol;
  status: UserStatus;
  storeName?: string;
  rating?: number;
  totalSales?: number;
  joinDate?: string;
}

export default function SellerProfilePage() {
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const {
    business,
    paymentOptions,
    loading,
    createBusiness,
    getBusinessByUserId,
    updateBusiness,
    createPaymentOption,
    deletePaymentOption,
    refreshPaymentOptions,
  } = useBusiness();
  
  // Estados de edición separados
  const [editingUser, setEditingUser] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(false);
  
  // Estados de guardado separados
  const [savingUser, setSavingUser] = useState(false);
  const [savingBusiness, setSavingBusiness] = useState(false);

  // Estados para edición
  const [editedUser, setEditedUser] = useState<UserInterface | null>(null);
  const [editedBusiness, setEditedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    console.log("Business:", business);
  }, [business]);

  useEffect(() => {
    console.log("User:", user);
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      loadData();
      // Inicializar datos para edición
      setEditedUser(user);
      setEditedBusiness(business);
    }
  }, [user, business]);

  const loadData = async () => {
    if (!user?.id) return;

    try {
      // Cargar datos del negocio por userId
      if (!business) {
        try {
          const loadedBusiness = await getBusinessByUserId(user.id);
          // Cargar opciones de pago después de obtener el negocio
          if (loadedBusiness?.id) {
            await refreshPaymentOptions();
          }
        } catch (error: any) {
          // Si no existe negocio, no es un error crítico
          console.log("No se encontró negocio para este usuario:", error.message);
        }
      } else {
        // Si ya tenemos el negocio, cargar opciones de pago
        if (business.id) {
          await refreshPaymentOptions();
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleCreateBusiness = async (data: Omit<Business, 'id' | 'averageScore' | 'userId'>) => {
    if (!user?.id) return;

    try {
      const newBusiness = await createBusiness(data);
      console.log("Business created:", newBusiness);
    } catch (error) {
      console.error("Error creating business:", error);
      throw error; // Re-throw para que el modal maneje el error
    }
  };

  const handleCreateLink = async (data: { link: string; pasarela: string }) => {
    console.log("Creating link", business?.id);
    if (!business?.id) return;

    try {
      await createPaymentOption({
        businessId: business.id,
        type: "link",
        link: data.link,
        pasarela: data.pasarela,
      });
    } catch (error) {
      console.error("Error creating link payment option:", error);
    }
  };

  const handleCreateTransfer = async (data: {
    cvu: string;
    cbu: string;
    otrosDatos: string;
  }) => {
    if (!business?.id) return;

    try {
      await createPaymentOption({
        businessId: business.id,
        type: "transferencia",
        cvu: data.cvu,
        cbu: data.cbu,
        otrosDatos: data.otrosDatos,
      });
    } catch (error) {
      console.error("Error creating transfer payment option:", error);
    }
  };

  const handleDeleteOption = async (id: string) => {
    try {
      await deletePaymentOption(id);
    } catch (error) {
      console.error("Error deleting payment option:", error);
    }
  };

  // Funciones para edición del usuario
  const handleEditUserClick = () => {
    setEditingUser(true);
    setEditedUser(user);
  };

  const handleCancelUserEdit = () => {
    setEditingUser(false);
    setEditedUser(user);
  };

  // Funciones para edición del negocio
  const handleEditBusinessClick = () => {
    setEditingBusiness(true);
    setEditedBusiness(business);
  };

  const handleCancelBusinessEdit = () => {
    setEditingBusiness(false);
    setEditedBusiness(business);
  };

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    const { name, value } = e.target;
    setEditedUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleBusinessDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedBusiness) return;
    const { name, value } = e.target;
    setEditedBusiness((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleBusinessTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (!editedBusiness) return;
    const { name, value } = e.target;
    setEditedBusiness((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Función para guardar cambios del usuario
  const handleSaveUserChanges = async () => {
    if (!editedUser || !user?.id) return;

    setSavingUser(true);
    try {
      // Actualizar usuario en el backend
      await axios.patch("/users", editedUser);
      
      // Actualizar usuario en el store de autenticación (el token se mantiene separado)
      setUser(editedUser);
      
      Swal.fire("Éxito", "Perfil de usuario actualizado correctamente", "success");
      setEditingUser(false);
    } catch (error) {
      console.error("Error saving user changes:", error);
      Swal.fire("Error", "Error al actualizar el perfil de usuario", "error");
    } finally {
      setSavingUser(false);
    }
  };

  // Función para guardar cambios del negocio
  const handleSaveBusinessChanges = async () => {
    if (!editedBusiness || !business?.id) return;

    setSavingBusiness(true);
    try {
      // Actualizar datos del negocio
      await updateBusiness(business.id, editedBusiness);
      
      Swal.fire("Éxito", "Información del negocio actualizada correctamente", "success");
      setEditingBusiness(false);
    } catch (error) {
      console.error("Error saving business changes:", error);
      Swal.fire("Error", "Error al actualizar la información del negocio", "error");
    } finally {
      setSavingBusiness(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout title="Perfil comercial">
        <div>Cargando...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Perfil comercial">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full h-full">
        {/* User Profile - Ocupa 2 columnas en mobile, 1 en desktop */}
        <div className="lg:col-span-1">
          <UserProfile
            user={user}
            editing={editingUser}
            saving={savingUser}
            onEditClick={handleEditUserClick}
            onCancelEdit={handleCancelUserEdit}
            onSaveChanges={handleSaveUserChanges}
            onUserDataChange={handleUserDataChange}
            editedUser={editedUser}
          />
        </div>

        {/* Business Profile - Ocupa 2 columnas en mobile, 1 en desktop */}
        <div className="lg:col-span-1">
          <SellerProfileForm
            business={business}
            editing={editingBusiness}
            saving={savingBusiness}
            onCreateBusiness={handleCreateBusiness}
            onEditClick={handleEditBusinessClick}
            onCancelEdit={handleCancelBusinessEdit}
            onSaveChanges={handleSaveBusinessChanges}
            onBusinessDataChange={handleBusinessDataChange}
            onBusinessTextareaChange={handleBusinessTextareaChange}
            editedBusiness={editedBusiness}
          />
        </div>

        {/* Payment Options - Ocupa 2 columnas en mobile, 2 en desktop */}
        <div className="lg:col-span-2">
          <PaymentOptionsForm
            paymentOptions={paymentOptions}
            loading={loading}
            onCreateLink={handleCreateLink}
            onCreateTransfer={handleCreateTransfer}
            onDeleteOption={handleDeleteOption}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
