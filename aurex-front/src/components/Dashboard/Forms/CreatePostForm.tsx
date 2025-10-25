import { useState, useEffect } from "react";
import { Post, initPost } from "../../../interfaces/Posts";
import { Product } from "../../../interfaces/Product";
import usePosts from "../../../hooks/Dashboard/posts/usePosts";
import useProducts from "../../../hooks/Dashboard/products/useProduct";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Button from "../../ui/Button";
import Input from "../Inputs/Input";
import SelectById from "../../ui/Inputs/SelectById";
import TextAreaInput from "../../ui/Inputs/Textarea";
import Checkbox from "../../ui/Inputs/Checkbox";

interface CreatePostFormProps {
  onSuccess?: (post: Post, files?: File[]) => void;
  onCancel?: () => void;
}

export default function CreatePostForm({
  onSuccess,
  onCancel,
}: CreatePostFormProps) {
  const [formData, setFormData] = useState<Post>(initPost());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const posts = usePosts();
  const products = useProducts();

  useEffect(() => {
    // Cargar productos al montar el componente
    products.get();
  }, []);

  const handleInputChange = (field: keyof Post, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleBooleanChange = (field: keyof Post, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleFileSelect = (index: number, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData((prev) => {
          const newImages = [...prev.images];
          newImages[index] = result;
          return { ...prev, images: newImages };
        });
        setImageFiles((prev) => {
          const newFiles = [...prev];
          newFiles[index] = file;
          return newFiles;
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => {
        const newImages = [...prev.images];
        newImages[index] = "";
        return { ...prev, images: newImages };
      });
      setImageFiles((prev) => {
        const newFiles = [...prev];
        newFiles.splice(index, 1);
        return newFiles;
      });
    }
  };


  const handleFeatureChange = (
    index: number,
    key: "name" | "value",
    value: string
  ) => {
    setFormData((prev) => {
      const newFeatures = [...prev.otherFeatures];
      newFeatures[index] = { ...newFeatures[index], [key]: value };
      return { ...prev, otherFeatures: newFeatures };
    });
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      otherFeatures: [...prev.otherFeatures, { name: "", value: "" }],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => {
      const newFeatures = prev.otherFeatures.filter((_, i) => i !== index);
      return { ...prev, otherFeatures: newFeatures };
    });
  };

  const handleFaqChange = (
    index: number,
    key: "name" | "value",
    value: string
  ) => {
    setFormData((prev) => {
      const newFaq = [...prev.faq];
      newFaq[index] = { ...newFaq[index], [key]: value };
      return { ...prev, faq: newFaq };
    });
  };

  const addFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faq: [...prev.faq, { name: "", value: "" }],
    }));
  };

  const removeFaq = (index: number) => {
    setFormData((prev) => {
      const newFaq = prev.faq.filter((_, i) => i !== index);
      return { ...prev, faq: newFaq };
    });
  };

  const handleProductSelect = (productId: string) => {
    const product = products.data.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setFormData((prev) => ({
        ...prev,
        productId: product.id ?? "",
        price: product.price || 0,
      }));
    }
  };


  const handleSubmit = async () => {
    console.log(1);

    try {
      const filteredFiles = imageFiles.filter((f) => f);
      const newPost = await posts.create(formData, filteredFiles);
      onSuccess?.(newPost, imageFiles);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleCancel = () => {
    setFormData(initPost());
    setSelectedProduct(null);
    setErrors({});
    setImageFiles([]);
    onCancel?.();
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Crear Nueva Publicación
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Selección de Producto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Producto *
          </label>
          <SelectById
            name="productId"
            label="Producto"
            list={products.data.map((product) => ({
              id: product.id || "",
              label: product.name,
            }))}
            value={formData.productId || ""}
            onChange={(e) => handleProductSelect(e.target.value)}
            error={errors.productId}
          />
          {selectedProduct && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Producto seleccionado:</strong> {selectedProduct.name}
              </p>
              <p className="text-sm text-gray-500">
                SKU: {selectedProduct.sku} | Categoría:{" "}
                {selectedProduct.category1} - {selectedProduct.category2}
              </p>
            </div>
          )}
        </div>

        {/* Título */}
        <Input
          name="title"
          label="Título de la Publicación *"
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          error={errors.title}
        />

        {/* Imágenes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imágenes (hasta 5)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
              >
                {formData.images[index] ? (
                  <div>
                    <img
                      src={formData.images[index]}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                    <Button
                      type="secondary"
                      onClick={() => handleFileSelect(index, null)}
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileSelect(index, e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id={`image-${index}`}
                    />
                    <label
                      htmlFor={`image-${index}`}
                      className="cursor-pointer"
                    >
                      <div className="text-gray-500">Seleccionar Imagen</div>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción (HTML) *
          </label>
          <ReactQuill
            value={formData.content}
            onChange={(value) => handleInputChange("content", value)}
            theme="snow"
            modules={{
              toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image'],
                ['clean']
              ],
            }}
            className={errors.content ? 'border-red-500' : ''}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        {/* Precio */}
        <Input
          name="price"
          label="Precio de Venta *"
          type="number"
          value={formData.price}
          onChange={(e) =>
            handleInputChange("price", parseFloat(e.target.value) || 0)
          }
          error={errors.price}
        />

        {/* Opciones de Pago */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opciones de Pago
          </label>
          <div className="space-y-2">
            <Checkbox
              name="sixInstallments"
              label="6 cuotas sin interés"
              value={formData.sixInstallments}
              onCheck={(e) =>
                handleBooleanChange("sixInstallments", e.target.checked)
              }
            />
            <Checkbox
              name="twelveInstallments"
              label="12 cuotas sin interés"
              value={formData.twelveInstallments}
              onCheck={(e) =>
                handleBooleanChange("twelveInstallments", e.target.checked)
              }
            />
          </div>
        </div>

        {/* Características */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="brand"
            label="Marca"
            type="text"
            value={formData.brand}
            onChange={(e) => handleInputChange("brand", e.target.value)}
          />
          <Input
            name="model"
            label="Modelo"
            type="text"
            value={formData.model}
            onChange={(e) => handleInputChange("model", e.target.value)}
          />
          <Input
            name="type"
            label="Tipo"
            type="text"
            value={formData.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
          />
          <Input
            name="color"
            label="Color"
            type="text"
            value={formData.color}
            onChange={(e) => handleInputChange("color", e.target.value)}
          />
          <Input
            name="volume"
            label="Volumen"
            type="text"
            value={formData.volume}
            onChange={(e) => handleInputChange("volume", e.target.value)}
          />
          <Input
            name="dimensions"
            label="Dimensiones"
            type="text"
            value={formData.dimensions}
            onChange={(e) => handleInputChange("dimensions", e.target.value)}
          />
        </div>

        {/* Otras Características */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Otras Características
          </label>
          {formData.otherFeatures.map((feature, index) => (
            <div key={index} className="flex items-end space-x-2 mb-2">
              <div className="flex-1">
                <Input
                  name={`feature-name-${index}`}
                  label="Nombre"
                  type="text"
                  value={feature.name}
                  onChange={(e) =>
                    handleFeatureChange(index, "name", e.target.value)
                  }
                />
              </div>
              <div className="flex-1">
                <Input
                  name={`feature-value-${index}`}
                  label="Valor"
                  type="text"
                  value={feature.value}
                  onChange={(e) =>
                    handleFeatureChange(index, "value", e.target.value)
                  }
                />
              </div>
              <Button type="secondary" onClick={() => removeFeature(index)}>
                Remover
              </Button>
            </div>
          ))}
          <Button type="secondary" onClick={addFeature}>
            Agregar Característica
          </Button>
        </div>

        {/* Preguntas Frecuentes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preguntas Frecuentes
          </label>
          {formData.faq.map((item, index) => (
            <div key={index} className="space-y-2 mb-4 p-4 border rounded">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Input
                    name={`faq-name-${index}`}
                    label="Pregunta"
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleFaqChange(index, "name", e.target.value)
                    }
                  />
                </div>
                <Button type="secondary" onClick={() => removeFaq(index)}>
                  Remover
                </Button>
              </div>
              <TextAreaInput
                name={`faq-value-${index}`}
                label="Respuesta"
                value={item.value}
                onChange={(e) =>
                  handleFaqChange(index, "value", e.target.value)
                }
              />
            </div>
          ))}
          <Button type="secondary" onClick={addFaq}>
            Agregar Pregunta Frecuente
          </Button>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="primary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            type="primary"
            disabled={posts.loading}
            onClick={() => handleSubmit()}
          >
            {posts.loading ? "Creando..." : "Crear Publicación"}
          </Button>
        </div>
      </form>
    </div>
  );
}
