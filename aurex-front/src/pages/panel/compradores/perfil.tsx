import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/Auth/useAuth";
import Swal from "sweetalert2";

import Input from "../../../components/Dashboard/Inputs/Input";
import DashboardLayout from "../../../components/Dashboard/ClientDashboard";
import Button from "../../../components/ui/Button";

export default function PerfilPage() {
  const { user, loading, completeCompradorRegistration } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      await completeCompradorRegistration({
        id: user.id,
        ...formData,
      });

      Swal.fire("Éxito", "Perfil actualizado correctamente", "success");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire("Error", "Error al actualizar el perfil", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Mi Perfil">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Información Personal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="name"
            value={formData.name}
            label="Nombre completo"
            onChange={handleInputChange}
            formulated={!isEditing}
          />
          <Input
            name="email"
            value={formData.email}
            label="Correo electrónico"
            type="email"
            onChange={handleInputChange}
            formulated={true}
          />
          <Input
            name="phone"
            value={formData.phone}
            label="Teléfono"
            onChange={handleInputChange}
            formulated={!isEditing}
          />
          <Input
            name="zipCode"
            value={formData.zipCode}
            label="Código postal"
            onChange={handleInputChange}
            formulated={!isEditing}
          />
          <Input
            name="address"
            value={formData.address}
            label="Dirección"
            onChange={handleInputChange}
            formulated={!isEditing}
          />
          <Input
            name="city"
            value={formData.city}
            label="Ciudad"
            onChange={handleInputChange}
            formulated={!isEditing}
          />
          <Input
            name="state"
            value={formData.state}
            label="Estado/Provincia"
            onChange={handleInputChange}
            formulated={!isEditing}
          />
        </div>

        <div className="flex justify-end">
          {!isEditing ? (
            <Button type="primary" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button type="secondary" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button
                type="primary"
                onClick={handleSave}
                disabled={saving}
                loading={saving}
              >
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
