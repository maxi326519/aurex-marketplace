import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { User as UserIcon, Edit, Star, Save, X } from "lucide-react";
import { User as UserInterface, UserStatus } from "../../../interfaces/Users";

import Button from "../../ui/Button";
import Input from "../../ui/Inputs/Input";

interface UserProfileProps {
  user: UserInterface;
  editing: boolean;
  saving: boolean;
  onEditClick: () => void;
  onCancelEdit: () => void;
  onSaveChanges: () => void;
  onUserDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editedUser: UserInterface | null;
}

export default function UserProfile({
  user,
  editing,
  saving,
  onEditClick,
  onCancelEdit,
  onSaveChanges,
  onUserDataChange,
  editedUser,
}: UserProfileProps) {
  return (
    <Card className="h-full w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Perfil Personal</CardTitle>
        {!editing ? (
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
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img
              src={user.photo || "/api/placeholder/100/100"}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
              <UserIcon size={16} className="text-white" />
            </div>
          </div>

          {editing ? (
            <div className="w-full space-y-3">
              <Input
                name="name"
                label="Nombre completo"
                value={editedUser?.name || ""}
                onChange={onUserDataChange}
                disabled={saving}
              />
              <Input
                name="email"
                label="Email"
                type="email"
                value={editedUser?.email || ""}
                onChange={onUserDataChange}
                disabled={saving}
              />
              <Input
                name="phone"
                label="Teléfono"
                value={editedUser?.phone || ""}
                onChange={onUserDataChange}
                disabled={saving}
              />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Vendedor desde: {new Date().toLocaleDateString()}
              </p>

              <div className="flex items-center gap-1 mt-2">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.8</span>
                <span className="text-gray-500">(154 ventas)</span>
              </div>
            </>
          )}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Estado:</span>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                user.status === UserStatus.ACTIVE
                  ? "bg-blue-100 text-blue-800"
                  : user.status === UserStatus.WAITING
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rol:</span>
            <span className="font-medium capitalize">{user.rol}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
