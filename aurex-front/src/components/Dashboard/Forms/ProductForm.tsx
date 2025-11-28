import { Upload, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import {
  Product,
  ProductStatus,
  VolumeType,
} from "../../../interfaces/Product";

import Modal from "../../Modal";
import Button from "../../ui/Button";

interface Props {
  onClose: () => void;
  onImportQuantity: () => void;
  onSubmit: (product: Product) => Promise<void>;
}

export default function ProductForm({
  onClose,
  onImportQuantity,
  onSubmit,
}: Props) {
  const [showIndividualForm, setShowIndividualForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    ean: "",
    sku: "",
    name: "",
    price: 0,
    volumeType: VolumeType.Chico,
    totalStock: 0,
    weight: 0,
    status: ProductStatus.HIDDEN,
  });

  const handleClose = () => {
    setShowIndividualForm(false);
    setFormData({
      ean: "",
      sku: "",
      name: "",
      price: 0,
      volumeType: VolumeType.Chico,
      totalStock: 0,
      weight: 0,
      status: ProductStatus.HIDDEN,
    });
    onClose();
  };

  const handleIndividualSubmit = async () => {
    if (
      !formData.ean ||
      !formData.sku ||
      !formData.name ||
      !formData.price ||
      formData.price <= 0
    ) {
      return;
    }

    await onSubmit(formData as Product);
    handleClose();
  };

  return (
    <Modal
      title="Nuevos Productos"
      className="max-w-[600px]"
      onClose={handleClose}
    >
      {!showIndividualForm ? (
        <div className="flex flex-col gap-4 p-6">
          <div className="flex gap-4">
            <button
              onClick={() => {
                handleClose();
                onImportQuantity();
              }}
              className="flex-1 flex md:flex-col items-center justify-center p-6 border-2 border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Upload size={48} className="mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Importar cantidad</h3>
              <p className="text-sm text-gray-600 text-center">
                Importa múltiples productos desde un archivo Excel
              </p>
            </button>
            <button
              onClick={() => setShowIndividualForm(true)}
              className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <FileSpreadsheet size={48} className="mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Carga individual</h3>
              <p className="text-sm text-gray-600 text-center">
                Crea un producto nuevo manualmente
              </p>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">EAN *</label>
              <input
                type="text"
                value={formData.ean || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ean: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ingresa el EAN"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">SKU *</label>
              <input
                type="text"
                value={formData.sku || ""}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ingresa el SKU"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ingresa el nombre del producto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Valor declarado *
              </label>
              <input
                type="number"
                value={formData.price || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: Number(e.target.value),
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Tipo de volumen *
              </label>
              <select
                value={formData.volumeType || "Chico"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    volumeType:
                      VolumeType[e.target.value as keyof typeof VolumeType] ||
                      0,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Tipo de volumen"
              >
                <option value="Chico">Chico</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="primary"
              variant="outline"
              onClick={() => setShowIndividualForm(false)}
            >
              Volver
            </Button>
            <Button type="primary" onClick={handleIndividualSubmit}>
              Crear Producto
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
