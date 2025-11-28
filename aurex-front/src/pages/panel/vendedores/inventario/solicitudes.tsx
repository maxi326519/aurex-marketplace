import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  RefreshCw,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import {
  MovementOrder,
  MovementOrderStatus,
  MovementOrderType,
} from "../../../../interfaces/MovementOrders";
import useMovementOrders from "../../../../hooks/Dashboard/movementOrders/useMovementOrders";
import { normalizeFilePath } from "../../../../lib/utils";

import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import Table from "../../../../components/Dashboard/Table/Table";
import Button from "../../../../components/ui/Button";

export default function SellersOrdersPage() {
  const navigate = useNavigate();
  const { pendings, approved, history } = useMovementOrders();
  const [filterType, setFilterType] = useState<string>("ALL");

  useEffect(() => {
    if (pendings.data.length === 0) pendings.get();
    if (approved.data.length === 0) approved.get();
    if (history.data.length === 0) history.get();
  }, []);

  const handleGetData = () => {
    pendings.get();
    approved.get();
    history.get();
  };

  const handleViewExcel = (data: MovementOrder) => {
    const normalizedPath = normalizeFilePath(data.sheetFile);
    window.open(`${import.meta.env.VITE_API_URL}/uploads/${normalizedPath}`);
  };

  const handleViewRemittance = (data: MovementOrder) => {
    if (data.remittance && data.type === MovementOrderType.ENTRADA) {
      const normalizedPath = normalizeFilePath(data.remittance);
      window.open(`${import.meta.env.VITE_API_URL}/uploads/${normalizedPath}`);
    }
  };

  const allOrders = [...pendings.data, ...approved.data, ...history.data];

  const filteredOrders =
    filterType === "ALL"
      ? allOrders
      : allOrders.filter((order) => order.type === filterType);

  const breadcrumb = [{ label: "Inventario" }, { label: "Solicitudes" }];

  return (
    <DashboardLayout
      title="Solicitudes"
      breadcrumb={breadcrumb}
      requireActiveUser={true}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <select
              title="Filtrar por tipo"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">Todos los tipos</option>
              <option value={MovementOrderType.ENTRADA}>Ingresos</option>
              <option value={MovementOrderType.SALIDA}>Egresos</option>
            </select>
            <Button type="primary" onClick={handleGetData}>
              <RefreshCw size={20} />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              type="primary"
              onClick={() =>
                navigate("/panel/vendedor/inventario/solicitudes/ingreso")
              }
            >
              <ArrowDownCircle size={18} />
              <span>Nuevo Ingreso</span>
            </Button>
            <Button
              type="primary"
              variant="outline"
              onClick={() =>
                navigate("/panel/vendedor/inventario/solicitudes/egreso")
              }
            >
              <ArrowUpCircle size={18} />
              <span>Nuevo Egreso</span>
            </Button>
          </div>
        </div>
        <Table
          columns={tableColumns(handleViewExcel, handleViewRemittance)}
          data={filteredOrders}
        />
      </div>
    </DashboardLayout>
  );
}

const tableColumns = (
  handleViewExcel: (data: MovementOrder) => void,
  handleViewRemittance: (data: MovementOrder) => void
) => {
  return [
    {
      header: "Tipo",
      key: "type",
      render: (row: MovementOrder) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            row.type === MovementOrderType.ENTRADA
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.type === MovementOrderType.ENTRADA ? "Ingreso" : "Egreso"}
        </span>
      ),
    },
    {
      header: "Fecha",
      key: "date",
      render: (row: MovementOrder) =>
        new Date(row.date).toLocaleString("es-CO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      header: "Fecha Recepción",
      key: "receptionDate",
      render: (row: MovementOrder) =>
        row.receptionDate
          ? new Date(row.receptionDate).toLocaleString("es-CO", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "-",
    },
    {
      header: "Estado",
      key: "state",
      render: (row: MovementOrder) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            row.state === MovementOrderStatus.PENDING
              ? "bg-yellow-100 text-yellow-800"
              : row.state === MovementOrderStatus.RECEIVED
              ? "bg-blue-100 text-blue-800"
              : row.state === MovementOrderStatus.PARTIAL
              ? "bg-orange-100 text-orange-800"
              : row.state === MovementOrderStatus.COMPLETED
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.state}
        </span>
      ),
    },
    {
      header: "Acciones",
      key: "",
      render: (row: MovementOrder) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            variant="outline"
            onClick={() => handleViewExcel(row)}
          >
            <Download size={18} /> Excel
          </Button>
          {row.type === MovementOrderType.ENTRADA && row.remittance && (
            <Button
              type="primary"
              variant="outline"
              onClick={() => handleViewRemittance(row)}
            >
              <Download size={18} /> Remito
            </Button>
          )}
        </div>
      ),
    },
  ];
};
