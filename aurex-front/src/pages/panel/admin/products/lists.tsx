import { Product, ProductStatus, Stock } from "../../../../interfaces/Product";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProducts from "../../../../hooks/Dashboard/products/useProduct";

import DashboardLayout from "../../../../components/Dashboard/AdminDashboard";
import Controls from "../../../../components/Dashboard/Controls/Controls";
import Table from "../../../../components/Dashboard/Table/Table";
import Modal from "../../../../components/Modal";
import useStock from "../../../../hooks/Dashboard/stock/useStock";

const tableColumns = (
  handleViewStock: (product: Product) => void,
  handleEdit: (data: Product) => void,
  handleDelete: (data: Product) => void
) => [
  { header: "SKU", key: "sku", reder: (row: Product) => <b>{row.sku}</b> },
  { header: "Nombre", key: "name" },
  {
    header: "Valor declarado",
    key: "value",
    render: (row: Product) => <span>${Number(row.price)?.toFixed(2)}</span>,
  },
  {
    header: "Stock físico",
    key: "physicalStock",
    render: (row: Product) => (
      <div className="flex items-center gap-2">
        <button
          title="Ver stock"
          aria-label="Ver stock"
          onClick={() => handleViewStock(row)}
          className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition"
        >
          <Eye className="h-4 w-4 text-gray-600" />
        </button>
        <span>{row.totalStock} un.</span>
      </div>
    ),
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
          className={`flex justify-center items-center gap-2 p-2 w-[120px] border rounded-md ${
            statusColors[row.status]
          }`}
        >
          {row.status === ProductStatus.PUBLISHED && (
            <Eye className="h-4 w-4" />
          )}
          {row.status === ProductStatus.HIDDEN && (
            <EyeOff className="h-4 w-4" />
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
  const [openModal, setOpenModal] = useState(false);

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
    // TODO: Complete funciton
    console.log("Ver stock:", product);
    stocks.getByProduct(product.id!).finally(() => {
      setOpenModal(true);
    });
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
        {openModal && (
          <Modal title="Stock" onClose={() => setOpenModal(false)}>
            <Table
              data={stocks.data}
              columns={[
                {
                  header: "Total",
                  key: "quantity",
                  render: (row: Stock) => <span>{row.amount}</span>,
                },
                {
                  header: "Publicado",
                  key: "location",
                  render: (row: Stock) => <span>{row.enabled}</span>,
                },
                {
                  header: "Ubicación",
                  key: "location",
                  render: (row: Stock) => (
                    <span>
                      {row.storage?.rag}/{row.storage?.site}
                    </span>
                  ),
                },
              ]}
            />
          </Modal>
        )}
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
          columns={tableColumns(handleViewStock, handleEdit, handleDelete)}
          data={products.data}
        />
      </div>
    </DashboardLayout>
  );
}
