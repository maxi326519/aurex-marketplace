import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import useOrders from "../../../../hooks/Dashboard/orders/useOrders";

import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import Table from "../../../../components/Dashboard/Table/Table";
import Button from "../../../../components/ui/Button";

const tableColumns = [
  { header: "ID", key: "id" },
  { header: "Fecha", key: "date" },
  { header: "Estado", key: "status" },
  { header: "Clicks", key: "clicks" },
  { header: "Precio Total", key: "totalPrice" },
  { header: "ID Usuario", key: "UserId" },
];

export default function SellerOrdersPage() {
  const orders = useOrders();

  useEffect(() => {
    handleGetData();
  }, []);

  async function handleGetData() {
    orders.get();
  }

  return (
    <DashboardLayout title="Ventas / Pedidos">
      <div className="flex justify-end pb-4">
        <Button type="primary" onClick={handleGetData}>
          <RefreshCcw />
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <Table columns={tableColumns} data={orders.data} />
      </div>
    </DashboardLayout>
  );
}
