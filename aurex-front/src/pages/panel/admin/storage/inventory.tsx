import { ProductStatus, Stock } from "../../../../interfaces/Product";
import { FilterConfig } from "../../../../components/Dashboard/Filters/Filters";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useStock from "../../../../hooks/Dashboard/stock/useStock";

import DashboardLayout from "../../../../components/Dashboard/AdminDashboard";
import Controls from "../../../../components/Dashboard/Controls/Controls";
import Table from "../../../../components/Dashboard/Table/Table";

const tableColumns = [
  {
    header: "Nombre",
    key: "name",
    render: (row: any) => {
      const product = row.Product || row.product;
      return <span className="text-gray-800">{product?.name || "-"}</span>;
    },
  },
  {
    header: "SKU",
    key: "sku",
    render: (row: any) => {
      const product = row.Product || row.product;
      return (
        <span className="font-semibold text-gray-900">
          {product?.sku || "-"}
        </span>
      );
    },
  },
  {
    header: "EAN",
    key: "ean",
    render: (row: any) => {
      const product = row.Product || row.product;
      return (
        <span className="font-mono text-sm text-gray-700">
          {product?.ean || "-"}
        </span>
      );
    },
  },
  {
    header: "Stock Total",
    key: "totalStock",
    render: (row: any) => {
      const product = row.Product || row.product;
      return (
        <span className="font-medium text-gray-700">
          {product?.totalStock ?? "-"}
        </span>
      );
    },
  },
  {
    header: "Stock Habilitado",
    key: "enabled",
    render: (row: Stock) => (
      <span
        className={`px-2 py-1 rounded text-sm font-medium ${
          row.enabled > 0
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.enabled || 0}
      </span>
    ),
  },
  {
    header: "Estado",
    key: "status",
    render: (row: any) => {
      const product = row.Product || row.product;
      const statusColors: Record<ProductStatus, string> = {
        [ProductStatus.PUBLISHED]: "bg-blue-100 text-blue-800",
        [ProductStatus.HIDDEN]: "bg-gray-100 text-gray-800",
        [ProductStatus.EMPTY]: "bg-red-100 text-red-800",
      };
      const status = product?.status || ProductStatus.EMPTY;

      return (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            statusColors[status as ProductStatus]
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    header: "Almacén",
    key: "storage",
    render: (row: any) => {
      const storage = row.Storage || row.storage;
      return (
        <span className="text-gray-700">
          {storage?.rag && storage?.site
            ? `${storage.rag}/${storage.site}`
            : "-"}
        </span>
      );
    },
  },
];

const filtersConfig: FilterConfig = [
  {
    key: "user",
    type: "select",
    label: "Usuario",
    options: ["Maximiliano", "Alberto"], // Lista de usuarios
  },
  {
    key: "storage",
    type: "select",
    label: "Almacén",
    options: ["Almacén Central", "Almacén Secundario"], // Lista de almacenes
  },
];

export default function InventarioPage() {
  const [searchParams] = useSearchParams();
  const stocks = useStock();
  const storageId = searchParams.get("storageId");

  useEffect(() => {
    if (storageId) {
      // Si hay un storageId en la URL, obtener stock por almacén (ya incluye productos)
      stocks.getByStorage(storageId);
    } else {
      // Si no hay storageId, obtener todo el stock con datos del producto
      stocks.get(true);
    }
  }, [storageId]);

  return (
    <DashboardLayout title="Almacén / Inventario">
      <div className="flex flex-col gap-3">
        {storageId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Mostrando stock del almacén seleccionado
            </p>
          </div>
        )}
        <Controls
          filtersConfig={filtersConfig}
          filtersData={{}}
          onFilter={() => {}}
        />
        <Table
          columns={tableColumns}
          data={stocks.data}
          loading={stocks.loading.get}
        />
      </div>
    </DashboardLayout>
  );
}
