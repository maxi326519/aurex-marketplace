import { Download, RefreshCw, Store } from "lucide-react";
import { normalizeFilePath } from "../../../../lib/utils";
import { MovementOrder } from "../../../../interfaces/MovementOrders";
import { useEffect } from "react";
import { User } from "../../../../interfaces/Users";
import useMovementOrders from "../../../../hooks/Dashboard/movementOrders/useMovementOrders";
import useUsers from "../../../../hooks/Dashboard/users/useUsers";

import DashboardLayout from "../../../../components/Dashboard/AdminDashboard";
import Table from "../../../../components/Dashboard/Table/Table";
import Button from "../../../../components/ui/Button";

export default function MovementOrdersHistory() {
  const users = useUsers();
  const { history } = useMovementOrders();

  useEffect(() => {
    if (history.data.length === 0) handleGetData();
  }, []);

  const handleGetData = () => {
    history.get();
    users.get();
  };

  const handleGetUser = (movementOrder: MovementOrder): User | undefined => {
    return users.data.find((user) => user.id === movementOrder.UserId);
  };

  const handleViewExcel = (data: MovementOrder) => {
    const normalizedPath = normalizeFilePath(data.sheetFile);
    window.open(`${import.meta.env.VITE_API_URL}/uploads/${normalizedPath}`);
  };

  const handleViewRemittance = (data: MovementOrder) => {
    const normalizedPath = normalizeFilePath(data.remittance);
    window.open(`${import.meta.env.VITE_API_URL}/uploads/${normalizedPath}`);
  };

  return (
    <DashboardLayout
      title="Órdenes de Movimiento / Historial"
      breadcrumb={[
        {
          label: "Órdenes de Movimiento",
          href: "",
        },
        { label: "Historial", href: "/panel/admin/solicitudes/historial" },
      ]}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-end">
          <Button type="primary" onClick={handleGetData}>
            <RefreshCw size={20} />
          </Button>
        </div>
        <Table
          columns={tableColumns(
            handleGetUser,
            handleViewExcel,
            handleViewRemittance
          )}
          data={history.data}
        />
      </div>
    </DashboardLayout>
  );
}

const tableColumns = (
  handleGetUser: (row: MovementOrder) => User | undefined,
  handleViewExcel: (data: MovementOrder) => void,
  handleViewRemittance: (data: MovementOrder) => void
) => {
  return [
    {
      header: "Vendedor",
      key: "",
      render: (row: MovementOrder) => {
        const user = handleGetUser(row);

        return (
          <div className="flex items-center gap-4">
            <div className="flex justify-center items-center w-14 h-14 rounded-full border border-[#888] overflow-hidden">
              {user ? (
                <img
                  className="w-full h-full object-cover"
                  src={user.photo}
                  alt={user.name || "Usuario"}
                />
              ) : (
                <Store strokeWidth={1} size={25} color="#888" />
              )}
            </div>
            <span>{user?.name || ""}</span>
          </div>
        );
      },
    },
    {
      header: "Tipo",
      key: "type",
      render: (row: MovementOrder) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            row.type === "ENTRADA"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.type === "ENTRADA" ? "Ingreso" : "Egreso"}
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
            row.state === "Pendiente"
              ? "bg-yellow-100 text-yellow-800"
              : row.state === "Aprobado"
              ? "bg-blue-100 text-blue-800"
              : row.state === "Parcial"
              ? "bg-orange-100 text-orange-800"
              : row.state === "Completado"
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
          {row.type === "ENTRADA" && row.remittance && (
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
