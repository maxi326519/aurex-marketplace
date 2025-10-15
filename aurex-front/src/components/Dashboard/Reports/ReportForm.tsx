import { useState } from "react";
import Button from "../../ui/Button";
import Input from "../../ui/Inputs/Input";
import TextAreaInput from "../../ui/Inputs/Textarea";

interface ReportFormProps {
  onSubmit: (openReason: string, description: string) => void;
  onBackClick?: () => void;
  hasHistory: boolean;
  loading?: boolean;
}

export default function ReportForm({
  onSubmit,
  onBackClick,
  hasHistory,
  loading = false,
}: ReportFormProps) {
  const [openReason, setOpenReason] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ openReason?: string; description?: string }>({});

  const validateForm = () => {
    const newErrors: { openReason?: string; description?: string } = {};

    if (!openReason.trim()) {
      newErrors.openReason = "El motivo del reporte es requerido";
    }

    if (!description.trim()) {
      newErrors.description = "La descripción es requerida";
    } else if (description.trim().length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(openReason, description);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Crear reporte
          </h2>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Por favor proporciona detalles específicos sobre el problema para que podamos ayudarte mejor.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivo del reporte *
          </label>
          <Input
            name="openReason"
            type="text"
            label="Ej: Producto dañado, producto no llegó, problema con vendedor..."
            value={openReason}
            onChange={(e) => setOpenReason(e.target.value)}
            error={errors.openReason}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción detallada *
          </label>
          <TextAreaInput
            name="description"
            label="Describe el problema con el mayor detalle posible. Incluye fechas, números de seguimiento, fotos si las tienes, etc."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
          />
          <p className="text-xs text-gray-500 mt-1">
            Mínimo 10 caracteres ({description.length}/10)
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="primary"
          className="w-full"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
        >
          {loading ? "Enviando reporte..." : "Enviar reporte"}
        </Button>

        {hasHistory && onBackClick && (
          <Button
            type="secondary"
            variant="outline"
            className="w-full"
            onClick={onBackClick}
            disabled={loading}
          >
            ← Volver atrás
          </Button>
        )}
      </div>
    </div>
  );
}
