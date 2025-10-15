import { CheckCircle, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { User as UserInterface } from "../../../interfaces/Users";
import { useState } from "react";

import Modal from "../../Modal";
import Button from "../../ui/Button";

interface Props {
  user: UserInterface | null;
  onClose: () => void;
  onEnableUser: (userId: string) => Promise<void>;
}

export default function UserStatusModal({
  user,
  onClose,
  onEnableUser,
}: Props) {
  const [isEnabling, setIsEnabling] = useState(false);

  const handleEnable = async () => {
    if (!user) return;

    setIsEnabling(true);
    try {
      await onEnableUser(user.id!);
      onClose();
    } catch (error) {
      console.error("Error enabling user:", error);
    } finally {
      setIsEnabling(false);
    }
  };

  if (!user) return null;

  return (
    <Modal title="Habilitar Usuario" onClose={onClose}>
      <div className="p-6">
        {/* Información del usuario */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Datos del usuario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}

            {user.address && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="font-medium text-gray-900">{user.address}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Rol</p>
                <p className="font-medium text-gray-900">{user.rol}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de confirmación */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">
                ¿Habilitar este usuario?
              </h4>
              <p className="text-sm text-blue-700">
                Al habilitar este usuario, podrá acceder a todas las
                funcionalidades del sistema y comenzar a vender productos.
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 justify-end">
          <Button type="secondary" onClick={onClose} disabled={isEnabling}>
            Cancelar
          </Button>
          <Button
            type="primary"
            onClick={handleEnable}
            disabled={isEnabling}
            className="bg-green-600 hover:bg-green-700"
          >
            {isEnabling ? "Habilitando..." : "Habilitar Usuario"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
