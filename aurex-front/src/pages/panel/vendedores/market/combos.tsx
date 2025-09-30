import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import Table from "../../../../components/Dashboard/Table/Table";

const tableColumns = [
  { header: "EAN", key: "ean" },
  { header: "SKU", key: "sku" },
  { header: "Nombre", key: "name" },
  { header: "Valor declarado", key: "value" },
  { header: "Tipo volumen", key: "volumeType" },
  { header: "Stock físico", key: "physicalStock" },
  { header: "Ubicación", key: "location" },
];

export default function SellersProductsCombosPage() {
  const rows: [] = [];

  return (
    <DashboardLayout title="Productos / Combos">
      <div className="flex flex-col gap-3">
        <Table columns={tableColumns} data={rows} />
      </div>
    </DashboardLayout>
  );
}
