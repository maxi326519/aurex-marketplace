import { initUser, User, UserRol, UserStatus } from "../../../interfaces/Users";
import { useEffect, useState } from "react";
import { ReactInput } from "../../../interfaces/Types";

import Input from "../Inputs/Input";
import Button from "../../ui/Button";
import SelectInput from "../Inputs/SelectInput";

interface Props {
  data?: User;
  onClose: () => void;
  onSubmit: (data: User, file?: File | null) => void;
}

export default function UserForm({ data, onClose, onSubmit }: Props) {
  const [user, setUser] = useState<User>(initUser());
  const [error, setError] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<File | null>(null);

  useEffect(() => {
    if (data) setUser(data);
  }, [data]); // Added dependency

  function handleClose() {
    onClose();
    setUser(initUser());
    setError({});
    setImagePreview(null);
  }

  function handleChange(event: ReactInput) {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (error[name]) {
      setError((prev) => {
        const newError = { ...prev };
        delete newError[name];
        return newError;
      });
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setUser((prev) => ({ ...prev, photo: URL.createObjectURL(file) }));
      setImagePreview(file);

      // Clear photo error
      if (error.photo) {
        setError((prev) => {
          const newError = { ...prev };
          delete newError.photo;
          return newError;
        });
      }
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (handleValidations()) {
      onSubmit(user, imagePreview);
      handleClose();
    }
  }

  function handleValidations(): boolean {
    const newError: Record<string, string> = {};
    let isValid = true;

    // Required fields validation
    if (!user.name.trim()) {
      newError.name = "Este campo es requerido";
      isValid = false;
    }

    if (!user.email.trim()) {
      newError.email = "Este campo es requerido";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newError.email = "El formato del email no es válido";
      isValid = false;
    }

    /*     if (!user.photo) {
      newError.photo = "La foto es requerida";
      isValid = false;
    } */

    if (!user.rol) {
      newError.rol = "Este campo es requerido";
      isValid = false;
    }

    if (!user.status) {
      newError.status = "Este campo es requerido";
      isValid = false;
    }

    setError(newError);
    return isValid;
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-center items-center p-5 w-full h-full bg-[#0003]">
      <form
        className="flex flex-col gap-5 max-w-[400px] w-full p-5 rounded-sm border bg-white"
        onSubmit={handleSubmit}
      >
        <header className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {data ? "Editar usuario" : "Nuevo usuario"}
          </h3>
          <button
            className="p-2 text-gray-500 hover:text-red-500 bg-transparent text-lg font-bold"
            onClick={handleClose}
            type="button"
          >
            ×
          </button>
        </header>

        <div className="flex flex-col gap-3">
          {/* Image Preview */}
          {user.photo && (
            <div className="flex justify-center">
              <img
                src={user.photo}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border"
              />
            </div>
          )}
          <label className="flex flex-col gap-2">
            Cargar imagen de portada
            <input name="photo" type="file" onChange={handleImageChange} />
          </label>
          <Input
            name="name"
            value={user.name}
            label="Nombre"
            type="text"
            error={error.name}
            onChange={handleChange}
          />
          <Input
            name="email"
            value={user.email}
            label="Correo Electrónico"
            type="email"
            error={error.email}
            onChange={handleChange}
          />
          <SelectInput
            name="rol"
            value={user.rol}
            label="Rol"
            list={Object.values(UserRol).map((option) => option)}
            error={error.rol}
            onChange={handleChange}
          />
          <SelectInput
            name="status"
            value={user.status}
            label="Estado"
            list={Object.values(UserStatus).map((option) => option)}
            error={error.rol}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="primary" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="primary" submit>
            {data ? "Actualizar" : "Agregar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
