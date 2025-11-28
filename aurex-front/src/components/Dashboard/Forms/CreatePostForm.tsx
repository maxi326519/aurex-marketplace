import { useState, useEffect } from "react";
import { Post, initPost } from "../../../interfaces/Posts";
import { Product } from "../../../interfaces/Product";
import usePosts from "../../../hooks/Dashboard/posts/usePosts";
import useProducts from "../../../hooks/Dashboard/products/useProduct";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import Button from "../../ui/Button";
import Input from "../Inputs/Input";
import SearchSelect from "../Inputs/SearchSelect";
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
  const [productSearchTerm, setProductSearchTerm] = useState<string>("");
  const [productList, setProductList] = useState<Array<{ key: string; value: string }>>([]);

  const posts = usePosts();
  const products = useProducts();

  useEffect(() => {
    // Cargar productos iniciales al montar el componente
    products.get(1, 50).then(() => {
      updateProductList("");
    });
  }, []);

  // Actualizar lista de productos cuando cambian los datos o el término de búsqueda
  useEffect(() => {
    updateProductList(productSearchTerm);
  }, [products.data, productSearchTerm]);

  const updateProductList = (searchTerm: string) => {
    const filtered = products.data
      .filter((product) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(term) ||
          product.sku.toLowerCase().includes(term) ||
          product.ean.toLowerCase().includes(term)
        );
      })
      .map((product) => ({
        key: product.id || "",
        value: `${product.sku} - ${product.name}`,
      }));
    setProductList(filtered);
  };

  const handleProductSearch = (searchTerm: string) => {
    setProductSearchTerm(searchTerm);
    // Si hay un término de búsqueda, buscar en el servidor
    if (searchTerm) {
      products.searchProducts(searchTerm);
    } else {
      // Si está vacío, cargar productos iniciales
      products.get(1, 50);
    }
  };

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

  const handleProductSelect = (item: { key: string; value: string }) => {
    const product = products.data.find((p) => p.id === item.key);
    if (product) {
      setSelectedProduct(product);
      setFormData((prev) => ({
        ...prev,
        productId: product.id ?? "",
        price: product.price || 0,
      }));
    } else if (!item.key) {
      // Si se limpió la selección
      setSelectedProduct(null);
      setFormData((prev) => ({
        ...prev,
        productId: "",
        price: 0,
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
        <SearchSelect
          name="productId"
          label="Producto *"
          value={formData.productId || ""}
          list={productList}
          loading={products.loading.search || products.loading.get}
          onSearch={handleProductSearch}
          onSelect={handleProductSelect}
          error={errors.productId}
          placeholder="Buscar por SKU, EAN o nombre..."
          displayValue={selectedProduct ? `${selectedProduct.sku} - ${selectedProduct.name}` : undefined}
        />
        {selectedProduct && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Producto seleccionado:</strong> {selectedProduct.name} (SKU: {selectedProduct.sku}, EAN: {selectedProduct.ean})
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Precio base: ${selectedProduct.price}
            </p>
          </div>
        )}

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
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [
                  { list: "ordered" },
                  { list: "bullet" },
                  { indent: "-1" },
                  { indent: "+1" },
                ],
                ["link", "image"],
                ["clean"],
              ],
            }}
            className={errors.content ? "border-red-500" : ""}
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
