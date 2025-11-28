import { useState } from "react";
import { Business } from "../../../interfaces/Business";
import { X, Building2 } from "lucide-react";

import Button from "../../ui/Button";
import Input from "../../ui/Inputs/Input";
import TextAreaInput from "../../ui/Inputs/Textarea";

interface CreateBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBusiness: (
    data: Omit<Business, "id" | "averageScore" | "userId">
  ) => Promise<void>;
  loading: boolean;
}

export default function CreateBusinessModal({
  isOpen,
  onClose,
  onCreateBusiness,
  loading,
}: CreateBusinessModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del negocio es obligatorio";
    }

    if (!formData.type.trim()) {
      newErrors.type = "El tipo de negocio es obligatorio";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria";
    }

    if (!formData.address.trim()) {
      newErrors.address = "La dirección es obligatoria";
    }

    if (!formData.city.trim()) {
      newErrors.city = "La ciudad es obligatoria";
    }

    if (!formData.state.trim()) {
      newErrors.state = "El estado/provincia es obligatorio";
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "El código postal es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        console.log(formData);
        await onCreateBusiness(formData);
        handleClose();
      } catch (error) {
        console.error("Error creating business:", error);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      type: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Building2 size={24} className="text-blue-600" />
            <h2 className="text-xl font-semibold">Crear Negocio</h2>
          </div>
          <Button
            type="secondary"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="name"
              label="Nombre del negocio *"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
              error={errors.name}
            />
            <Input
              name="type"
              label="Tipo de negocio *"
              value={formData.type}
              onChange={handleInputChange}
              disabled={loading}
              error={errors.type}
            />
          </div>

          <TextAreaInput
            name="description"
            label="Descripción del negocio *"
            value={formData.description}
            onChange={handleInputChange}
            disabled={loading}
            error={errors.description}
          />

          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">
              Información de Contacto
            </h3>
            <Input
              name="address"
              label="Dirección *"
              value={formData.address}
              onChange={handleInputChange}
              disabled={loading}
              error={errors.address}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                name="city"
                label="Ciudad *"
                value={formData.city}
                onChange={handleInputChange}
                disabled={loading}
                error={errors.city}
              />
              <Input
                name="state"
                label="Estado/Provincia *"
                value={formData.state}
                onChange={handleInputChange}
                disabled={loading}
                error={errors.state}
              />
              <Input
                name="zipCode"
                label="Código postal *"
                value={formData.zipCode}
                onChange={handleInputChange}
                disabled={loading}
                error={errors.zipCode}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="secondary"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              onClick={() => handleSubmit({} as React.FormEvent)}
              loading={loading}
              className="flex-1"
            >
              Crear Negocio
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
