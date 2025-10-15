import { useEffect } from "react";
import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import Table from "../../../../components/Dashboard/Table/Table";
import useProducts from "../../../../hooks/Dashboard/products/useProduct";

const tableColumns = [
  { header: "EAN", key: "ean", sortable: true },
  { header: "SKU", key: "sku", sortable: true },
  { header: "Nombre", key: "name", sortable: true },
  { header: "Valor declarado", key: "price" },
  { header: "Tipo volumen", key: "volumeType" },
  { header: "Stock", key: "totalStock", sortable: true },
];

export default function SellersProductsPage() {
  const products = useProducts();

  useEffect(() => {
    products.get();
  }, []);

  return (
    <DashboardLayout title="Productos / Listado" requireActiveUser={true}>
      <div className="flex flex-col gap-3">
        <Table columns={tableColumns} data={products.data} />
      </div>
    </DashboardLayout>
  );
}
