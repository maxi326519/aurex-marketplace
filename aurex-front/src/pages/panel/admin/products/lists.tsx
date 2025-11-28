import { Eye, EyeOff, Pencil, Trash2, History } from "lucide-react";
import { Product, ProductStatus } from "../../../../interfaces/Product";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProducts from "../../../../hooks/Dashboard/products/useProduct";

import DashboardLayout from "../../../../components/Dashboard/AdminDashboard";
import Controls from "../../../../components/Dashboard/Controls/Controls";
import Table from "../../../../components/Dashboard/Table/Table";
import useStock from "../../../../hooks/Dashboard/stock/useStock";
import ProductStockModal from "../../../../components/Dashboard/Modals/ProductStockModal";
import ProductMovementsModal from "../../../../components/Dashboard/Modals/ProductMovementsModal";

const tableColumns = (
  handleViewStock: (product: Product) => void,
  handleEdit: (data: Product) => void,
  handleDelete: (data: Product) => void,
  handleViewMovements: (product: Product) => void
) => [
  {
    header: "SKU",
    key: "sku",
    render: (row: Product) => (
      <span className="font-semibold text-gray-900">{row.sku}</span>
    ),
  },
  {
    header: "Nombre",
    key: "name",
    render: (row: Product) => <span className="text-gray-800">{row.name}</span>,
  },
  {
    header: "Valor declarado",
    key: "value",
    render: (row: Product) => (
      <span className="font-medium text-gray-700">
        ${Number(row.price)?.toFixed(2)}
      </span>
    ),
  },
  {
    header: "Stock",
    key: "stock",
    render: (row: Product) => {
      const totalStock = Number(row.totalStock) || 0;
      const reservedStock = Number(row.reservedStock) || 0;
      const availableStock = totalStock - reservedStock;

      return (
        <div className="flex items-start gap-2">
          <button
            title="Ver stock detallado"
            aria-label="Ver stock detallado"
            onClick={() => handleViewStock(row)}
            className="p-1 rounded border border-gray-300 hover:bg-gray-100 transition flex-shrink-0 mt-0.5"
          >
            <Eye className="h-3.5 w-3.5 text-gray-600" />
          </button>
          <div className="flex flex-col gap-0.5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">T:</span>
              <span className="font-medium text-gray-700">
                {totalStock.toFixed(0)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-green-600">D:</span>
              <span className="font-medium text-green-700">
                {availableStock.toFixed(0)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-orange-600">R:</span>
              <span className="font-medium text-orange-700">
                {reservedStock.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    header: "Estado",
    key: "status",
    render: (row: Product) => {
      const statusColors: Record<string, string> = {
        [ProductStatus.PUBLISHED]:
          "border-green-600 text-green-600 bg-green-100",
        [ProductStatus.EMPTY]: "border-red-600 text-red-600 bg-red-100",
        [ProductStatus.HIDDEN]:
          "border-yellow-600 text-yellow-600 bg-yellow-100",
      };

      return (
        <div
          className={`flex items-center gap-1 px-2 py-1 border rounded text-xs ${
            statusColors[row.status]
          }`}
        >
          {row.status === ProductStatus.PUBLISHED && (
            <Eye className="h-3 w-3" />
          )}
          {row.status === ProductStatus.HIDDEN && (
            <EyeOff className="h-3 w-3" />
          )}
          <span className="font-medium">{row.status}</span>
        </div>
      );
    },
  },
  {
    header: "Acciones",
    key: "actions",
    render: (row: Product) => (
      <div className="flex gap-2">
        <button
          title="Ver movimientos"
          onClick={() => handleViewMovements(row)}
          className="p-2 rounded-full border border-blue-300 hover:bg-blue-100 transition"
        >
          <History className="h-4 w-4 text-blue-600" />
        </button>
        <button
          title="Editar"
          onClick={() => handleEdit(row)}
          className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
        >
          <Pencil className="h-4 w-4 text-gray-600" />
        </button>
        <button
          title="Eliminar"
          onClick={() => handleDelete(row)}
          className="p-2 rounded-full border border-red-300 hover:bg-red-100 transition"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>
    ),
  },
];

export default function ProductsListPage() {
  const navigate = useNavigate();
  const products = useProducts();
  const stocks = useStock();
  const [openStockModal, setOpenStockModal] = useState(false);
  const [openMovementsModal, setOpenMovementsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    products.get();
  }, []);

  const handleNew = () => {
    navigate(`/panel/admin/products/nuevo`);
  };

  const handleReload = () => {
    products.get();
  };

  const handleEdit = (data: Product) => {
    navigate(`/panel/admin/products/editar/${data.id}`);
  };

  const handleViewStock = (product: Product) => {
    setSelectedProduct(product);
    stocks.getByProduct(product.id!).finally(() => {
      setOpenStockModal(true);
    });
  };

  const handleViewMovements = (product: Product) => {
    setSelectedProduct(product);
    setOpenMovementsModal(true);
  };

  const handleDelete = (product: Product) => {
    console.log("Eliminar:", product);
    products.remove(product.id!);
  };

  const handleOpenImport = () => {
    navigate("/panel/admin/products/imports");
  };

  return (
    <DashboardLayout title="Productos / Listado">
      <div className="flex flex-col gap-2">
        <ProductStockModal
          stocks={stocks.data}
          isOpen={openStockModal}
          onClose={() => {
            setOpenStockModal(false);
            setSelectedProduct(null);
          }}
        />
        <ProductMovementsModal
          product={selectedProduct}
          isOpen={openMovementsModal}
          onClose={() => {
            setOpenMovementsModal(false);
            setSelectedProduct(null);
          }}
          getMovementsByProduct={products.api.getMovementsByProduct}
        />
        <Controls
          btnConfig={[
            {
              label: "Recargar",
              onClick: handleReload,
            },
            {
              label: "Nuevo Producto",
              onClick: handleNew,
            },
            {
              label: "Importar Productos",
              onClick: handleOpenImport,
            },
          ]}
        />
        <Table
          columns={tableColumns(
            handleViewStock,
            handleEdit,
            handleDelete,
            handleViewMovements
          )}
          data={products.data}
        />
      </div>
    </DashboardLayout>
  );
}
