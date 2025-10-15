import { useState, useEffect } from "react";
import { Business } from "../../../interfaces/Business";
import { useAuth } from "../../../hooks/Auth/useAuth";
import { useBusiness } from "../../../hooks/Dashboard/useBusiness";
import {
  UserRol,
  UserStatus,
  User as UserInterface,
} from "../../../interfaces/Users";

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
  const {
    business,
    paymentOptions,
    loading,
    createBusiness,
    getBusiness,
    updateBusiness,
    createPaymentOption,
    deletePaymentOption,
    refreshPaymentOptions,
  } = useBusiness();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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
    if (!user?.businessId) return;

    try {
      // Cargar datos del negocio si no existen
      if (!business) {
        await getBusiness(user.businessId);
      }

      // Cargar opciones de pago
      if (business?.id) {
        await refreshPaymentOptions();
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

  // Funciones para edición
  const handleEditClick = () => {
    setEditing(true);
    setEditedUser(user);
    setEditedBusiness(business);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditedUser(user);
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

  const handleSaveChanges = async () => {
    if (!editedUser || !editedBusiness) return;

    setSaving(true);
    try {
      // Actualizar datos del negocio
      if (business?.id) {
        await updateBusiness(business.id, editedBusiness);
      }

      console.log("Saving user data:", editedUser);
      console.log("Saving business data:", editedBusiness);

      setEditing(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setSaving(false);
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
            editing={editing}
            saving={saving}
            onEditClick={handleEditClick}
            onCancelEdit={handleCancelEdit}
            onSaveChanges={handleSaveChanges}
            onUserDataChange={handleUserDataChange}
            editedUser={editedUser}
          />
        </div>

        {/* Business Profile - Ocupa 2 columnas en mobile, 1 en desktop */}
        <div className="lg:col-span-1">
          <SellerProfileForm
            business={business}
            editing={editing}
            saving={saving}
            onCreateBusiness={handleCreateBusiness}
            onEditClick={handleEditClick}
            onCancelEdit={handleCancelEdit}
            onSaveChanges={handleSaveChanges}
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
