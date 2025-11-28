import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Building2, Edit, Save, X, Plus } from "lucide-react";
import { Business } from "../../../interfaces/Business";

import Button from "../../ui/Button";
import Input from "../../ui/Inputs/Input";
import TextAreaInput from "../../ui/Inputs/Textarea";
import CreateBusinessModal from "./CreateBusinessModal";

interface SellerProfileFormProps {
  business: Business | null;
  editing: boolean;
  saving: boolean;
  onCreateBusiness: (
    data: Omit<Business, "id" | "averageScore" | "userId">
  ) => Promise<void>;
  onEditClick: () => void;
  onCancelEdit: () => void;
  onSaveChanges: () => void;
  onBusinessDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBusinessTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  editedBusiness: Business | null;
}

export default function SellerProfileForm({
  business,
  editing,
  saving,
  onCreateBusiness,
  onEditClick,
  onCancelEdit,
  onSaveChanges,
  onBusinessDataChange,
  onBusinessTextareaChange,
  editedBusiness,
}: SellerProfileFormProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateBusiness = async (
    data: Omit<Business, "id" | "averageScore" | "userId">
  ) => {
    await onCreateBusiness(data);
    setShowCreateModal(false);
  };
  
  return (
    <Card className="h-full w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Building2 size={20} />
          Información del Negocio
        </CardTitle>
        {!business ? (
          <Button type="primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            Crear Negocio
          </Button>
        ) : !editing ? (
          <Button type="primary" onClick={onEditClick}>
            <Edit size={16} />
            Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              type="secondary"
              variant="outline"
              onClick={onCancelEdit}
              disabled={saving}
            >
              <X size={16} />
              Cancelar
            </Button>
            <Button type="primary" onClick={onSaveChanges} loading={saving}>
              <Save size={16} />
              Guardar
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!business ? (
          <div className="text-center py-8">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-sm mb-2">
              No tienes un negocio configurado
            </p>
            <p className="text-gray-400 text-xs">
              Crea tu negocio para comenzar a vender
            </p>
          </div>
        ) : editing ? (
          <>
            <Input
              name="name"
              label="Nombre del negocio"
              value={editedBusiness?.name || ""}
              onChange={onBusinessDataChange}
              disabled={saving}
            />
            <Input
              name="type"
              label="Tipo de negocio"
              value={editedBusiness?.type || ""}
              onChange={onBusinessDataChange}
              disabled={saving}
            />
            <TextAreaInput
              name="description"
              label="Descripción del negocio"
              value={editedBusiness?.description || ""}
              onChange={onBusinessTextareaChange}
              disabled={saving}
            />
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Nombre:</span>
              <span className="font-medium">{business.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo:</span>
              <span className="font-medium">{business.type}</span>
            </div>
            {business.description && (
              <div className="flex flex-col">
                <span className="text-gray-600 mb-1">Descripción:</span>
                <span className="text-sm text-gray-700">
                  {business.description}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CreateBusinessModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateBusiness={handleCreateBusiness}
        loading={saving}
      />
    </Card>
  );
}
