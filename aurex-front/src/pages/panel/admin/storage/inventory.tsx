import { ProductStatus, Stock } from "../../../../interfaces/Product";
import { FilterConfig } from "../../../../components/Dashboard/Filters/Filters";
import { useState } from "react";

import DashboardLayout from "../../../../components/Dashboard/AdminDashboard";
import Controls from "../../../../components/Dashboard/Controls/Controls";
import Table from "../../../../components/Dashboard/Table/Table";

const tableColumns = [
  { header: "ID", key: "id" },
  { header: "Nombre", key: "name", render: (row: Stock) => row.product?.name },
  { header: "SKU", key: "sku", render: (row: Stock) => row.product?.sku },
  { header: "EAN", key: "ean", render: (row: Stock) => row.product?.ean },
  {
    header: "Stock Total",
    key: "totalStock",
    render: (row: Stock) => row.product?.totalStock,
  },
  {
    header: "Stock Habilitado",
    key: "enabled",
    render: (row: Stock) => (
      <span
        className={
          row.enabled > 0
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }
      >
        {row.enabled}
      </span>
    ),
  },
  {
    header: "Estado",
    key: "status",
    render: (row: Stock) => {
      const statusColors: Record<ProductStatus, string> = {
        [ProductStatus.PUBLISHED]: "bg-blue-100 text-blue-800",
        [ProductStatus.HIDDEN]: "bg-gray-100 text-gray-800",
        [ProductStatus.EMPTY]: "bg-red-100 text-red-800",
      };

      return (
        <span
          className={statusColors[row.product?.status || ProductStatus.EMPTY]}
        >
          {row.product?.status || ProductStatus.EMPTY}
        </span>
      );
    },
  },
  {
    header: "Almacén",
    key: "storage",
    render: (row: Stock) => row.storage?.rag + "/" + row.storage?.site,
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
  const [data, setData] = useState<Stock[]>([
    {
      amount: 10,
      enabled: 10,
      isFull: true,
      product: {
        id: "1",
        ean: "123456789",
        sku: "SKU001",
        name: "Producto 1",
        price: 100,
        volumeType: "Chico",
        weight: 0.5,
        category1: "Cat1",
        category2: "Cat2",
        totalStock: 10,
        status: ProductStatus.PUBLISHED,
      },
      storage: { id: "s1", rag: "RA", site: "A1" },
    },
    {
      amount: 0,
      enabled: 0,
      isFull: false,
      product: {
        id: "2",
        ean: "987654321",
        sku: "SKU002",
        name: "Producto 2",
        price: 200,
        volumeType: "Chico",
        weight: 1,
        category1: "Cat1",
        category2: "Cat2",
        totalStock: 0,
        status: ProductStatus.EMPTY,
      },
      storage: { id: "s2", rag: "RA", site: "A2" },
    },
  ]);

  const handleFilter = (filteredData: Stock[]) => {
    setData(filteredData);
  };

  return (
    <DashboardLayout title="Almacén / Inventario">
      <div className="flex flex-col gap-3">
        <Controls
          data={data}
          filtersConfig={filtersConfig}
          onFilter={handleFilter}
        />
        <Table columns={tableColumns} data={data} />
      </div>
    </DashboardLayout>
  );
}
