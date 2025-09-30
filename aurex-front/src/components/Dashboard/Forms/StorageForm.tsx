import { initStorage, Storage } from "../../../interfaces/Storage";
import { useEffect, useState } from "react";
import { ReactInput } from "../../../interfaces/Types";

import Input from "../Inputs/Input";
import Button from "../../ui/Button";

interface Props {
  data?: Storage;
  onClose: () => void;
  onSubmit: (data: Storage) => void;
}

export default function StorageForm({ data, onClose, onSubmit }: Props) {
  const [storage, setStorage] = useState<Storage>(initStorage());
  const [error, setError] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) setStorage(data);
  }, [data]);

  function handleClose() {
    onClose();
    setStorage(initStorage());
    setError({});
  }

  function handleChange(event: ReactInput) {
    const { name, value, type } = event.target;

    // Conversión a número si corresponde
    const parsedValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;

    setStorage((prev) => ({ ...prev, [name]: parsedValue }));

    // limpiar error si empieza a tipear
    if (error[name]) {
      setError((prev) => {
        const newError = { ...prev };
        delete newError[name];
        return newError;
      });
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (handleValidations()) {
      onSubmit(storage);
      handleClose();
    }
  }

  function handleValidations(): boolean {
    const newError: Record<string, string> = {};
    let isValid = true;

    [
      { key: "rag", value: !storage.rag.trim() },
      { key: "site", value: !storage.site.trim() },
      { key: "positions", value: storage.positions <= 0 },
      { key: "totalCapacity", value: storage.totalCapacity <= 0 },
      {
        key: "currentCapacity",
        value:
          storage.currentCapacity < 0 ||
          storage.currentCapacity > storage.totalCapacity,
      },
    ].map(({ key, value }) => {
      if (value) {
        newError[key] = "Este campo es requerido";
        isValid = false;
      }
    });
    
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
            {data ? "Editar Almacén" : "Nuevo Almacén"}
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
          <Input
            name="rag"
            value={storage.rag}
            label="RAG"
            type="text"
            error={error.rag}
            onChange={handleChange}
          />
          <Input
            name="site"
            value={storage.site}
            label="Sitio"
            type="text"
            error={error.site}
            onChange={handleChange}
          />
          <Input
            name="positions"
            value={storage.positions}
            label="Posiciones"
            type="number"
            error={error.positions}
            onChange={handleChange}
          />
          <Input
            name="currentCapacity"
            value={storage.currentCapacity}
            label="Capacidad Actual"
            type="number"
            error={error.currentCapacity}
            onChange={handleChange}
          />
          <Input
            name="totalCapacity"
            value={storage.totalCapacity}
            label="Capacidad Total"
            type="number"
            error={error.totalCapacity}
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
