import { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import Table from "../../../../components/Dashboard/Table/Table";
import SearchSelect from "../../../../components/Dashboard/Inputs/SearchSelect";
import Input from "../../../../components/Dashboard/Inputs/Input";
import Button from "../../../../components/ui/Button";
import useProducts from "../../../../hooks/Dashboard/products/useProduct";
import { Product } from "../../../../interfaces/Product";

interface ComboProduct {
  productId: string;
  product: Product;
  quantity: number;
  discount?: number;
}

const getTableColumns = (
  handleQuantityChange: (productId: string, quantity: number) => void,
  handleDiscountChange: (productId: string, discount: number) => void,
  handleRemoveProduct: (productId: string) => void
) => [
  {
    header: "SKU",
    key: "sku",
    render: (row: ComboProduct) => (
      <span className="font-medium">{row.product.sku}</span>
    ),
  },
  {
    header: "Nombre",
    key: "name",
    render: (row: ComboProduct) => <span>{row.product.name}</span>,
  },
  {
    header: "Cantidad",
    key: "quantity",
    render: (row: ComboProduct) => (
      <div className="w-24">
        <input
          type="number"
          min="1"
          value={row.quantity}
          onChange={(e) =>
            handleQuantityChange(row.productId, parseInt(e.target.value) || 1)
          }
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        />
      </div>
    ),
  },
  {
    header: "Precio Unitario",
    key: "price",
    render: (row: ComboProduct) => (
      <span>${(row.product.price || 0).toFixed(2)}</span>
    ),
  },
  {
    header: "Descuento %",
    key: "discount",
    render: (row: ComboProduct) => (
      <div className="w-24">
        <input
          type="number"
          min="0"
          max="100"
          value={row.discount || 0}
          onChange={(e) =>
            handleDiscountChange(
              row.productId,
              parseFloat(e.target.value) || 0
            )
          }
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        />
      </div>
    ),
  },
  {
    header: "Subtotal",
    key: "subtotal",
    render: (row: ComboProduct) => {
      const price = row.product.price || 0;
      const discount = row.discount || 0;
      const discountedPrice = price * (1 - discount / 100);
      return <span className="font-semibold">${(discountedPrice * row.quantity).toFixed(2)}</span>;
    },
  },
  {
    header: "Acciones",
    key: "actions",
    render: (row: ComboProduct) => (
      <button
        onClick={() => handleRemoveProduct(row.productId)}
        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
        title="Eliminar producto"
      >
        <Trash2 size={16} />
      </button>
    ),
  },
];

export default function SellersProductsCombosPage() {
  const products = useProducts();
  const [comboName, setComboName] = useState<string>("");
  const [comboPrice, setComboPrice] = useState<number>(0);
  const [comboProducts, setComboProducts] = useState<ComboProduct[]>([]);
  const [productList, setProductList] = useState<Array<{ key: string; value: string }>>([]);
  const [currentProductSearch, setCurrentProductSearch] = useState<string>("");

  useEffect(() => {
    // Cargar productos iniciales al montar el componente
    products.get(1, 50);
  }, []);

  // Actualizar lista de productos cuando cambian los datos, el término de búsqueda o los productos del combo
  useEffect(() => {
    // Filtrar productos que ya están en el combo
    const comboProductIds = comboProducts.map(cp => cp.productId);
    const filtered = products.data
      .filter((product) => {
        // Excluir productos que ya están en el combo
        if (comboProductIds.includes(product.id || "")) return false;
        
        if (!currentProductSearch) return true;
        const term = currentProductSearch.toLowerCase();
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
  }, [products.data, currentProductSearch, comboProducts]);

  const handleProductSearch = (searchTerm: string) => {
    setCurrentProductSearch(searchTerm);
    // Si hay un término de búsqueda, buscar en el servidor
    if (searchTerm) {
      products.searchProducts(searchTerm);
    } else {
      // Si está vacío, cargar productos iniciales
      products.get(1, 50);
    }
  };

  const handleAddProduct = (item: { key: string; value: string }) => {
    if (!item.key) return;
    
    const product = products.data.find((p) => p.id === item.key);
    if (product && !comboProducts.find(cp => cp.productId === item.key)) {
      setComboProducts((prev) => [
        ...prev,
        {
          productId: product.id || "",
          product,
          quantity: 1,
          discount: 0,
        },
      ]);
      // Limpiar búsqueda
      setCurrentProductSearch("");
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setComboProducts((prev) => prev.filter((cp) => cp.productId !== productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setComboProducts((prev) =>
      prev.map((cp) =>
        cp.productId === productId ? { ...cp, quantity: Math.max(1, quantity) } : cp
      )
    );
  };

  const handleDiscountChange = (productId: string, discount: number) => {
    setComboProducts((prev) =>
      prev.map((cp) =>
        cp.productId === productId
          ? { ...cp, discount: Math.max(0, Math.min(100, discount)) }
          : cp
      )
    );
  };

  const calculateTotal = () => {
    return comboProducts.reduce((total, cp) => {
      const price = cp.product.price || 0;
      const discount = cp.discount || 0;
      const discountedPrice = price * (1 - discount / 100);
      return total + discountedPrice * cp.quantity;
    }, 0);
  };

  const handleSubmit = () => {
    // TODO: Implementar creación de combo
    console.log("Crear combo:", {
      name: comboName,
      price: comboPrice,
      products: comboProducts,
      total: calculateTotal(),
    });
  };

  return (
    <DashboardLayout title="Productos / Combos" requireActiveUser={true}>
      <div className="flex flex-col gap-6">
        {/* Formulario de Combo */}
        <div className="w-full bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Crear Nuevo Combo
          </h2>

          <div className="space-y-6">
            {/* Información básica del combo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="comboName"
                label="Nombre del Combo *"
                type="text"
                value={comboName}
                onChange={(e) => setComboName(e.target.value)}
              />
              <Input
                name="comboPrice"
                label="Precio del Combo *"
                type="number"
                value={comboPrice}
                onChange={(e) => setComboPrice(parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Agregar productos */}
            <div>
              <SearchSelect
                name="productSearch"
                value=""
                label="Agregar Productos al Combo"
                list={productList}
                loading={products.loading.search || products.loading.get}
                onSearch={handleProductSearch}
                onSelect={handleAddProduct}
                placeholder="Buscar producto por SKU, EAN o nombre..."
                displayValue=""
              />
            </div>

            {/* Lista de productos del combo */}
            {comboProducts.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Productos en el Combo ({comboProducts.length})
                </label>
                <div className="border rounded-lg overflow-hidden">
                  <Table
                    columns={getTableColumns(
                      handleQuantityChange,
                      handleDiscountChange,
                      handleRemoveProduct
                    )}
                    data={comboProducts}
                    enableInternalPagination={false}
                  />
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">
                      Total Calculado:
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  {comboPrice > 0 && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">
                        Precio del Combo:
                      </span>
                      <span className="text-lg font-semibold text-gray-800">
                        ${comboPrice.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="secondary"
                onClick={() => {
                  setComboName("");
                  setComboPrice(0);
                  setComboProducts([]);
                }}
              >
                Limpiar
              </Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                disabled={!comboName || comboProducts.length === 0}
              >
                Crear Combo
              </Button>
            </div>
          </div>
        </div>

        {/* Lista de combos existentes */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Combos Existentes
          </h3>
          <Table
            columns={[
              { header: "Nombre", key: "name" },
              { header: "Precio", key: "price" },
              { header: "Productos", key: "products" },
              { header: "Acciones", key: "actions" },
            ]}
            data={[]}
            enableInternalPagination={false}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
