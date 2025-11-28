import { Calendar, Download, RefreshCw, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { normalizeFilePath } from "../../../../lib/utils";
import { User } from "../../../../interfaces/Users";
import {
  MovementOrder,
  MovementOrderStatus,
} from "../../../../interfaces/MovementOrders";
import useMovementOrders from "../../../../hooks/Dashboard/movementOrders/useMovementOrders";
import useUsers from "../../../../hooks/Dashboard/users/useUsers";

import DashboardLayout from "../../../../components/Dashboard/AdminDashboard";
import Table from "../../../../components/Dashboard/Table/Table";
import Button from "../../../../components/ui/Button";
import Modal from "../../../../components/Modal";
import Swal from "sweetalert2";

export default function MovementOrdersPending() {
  const users = useUsers();
  const { pendings } = useMovementOrders();
  const [openModal, setOpenModal] = useState<MovementOrder | null>(null);
  const [receptionDate, setReceptionDate] = useState<string>("");

  useEffect(() => {
    if (pendings.data.length === 0) handleGetData();
  }, []);

  const handleGetData = () => {
    pendings.get();
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
    if (data.remittance && data.type === "ENTRADA") {
      const normalizedPath = normalizeFilePath(data.remittance);
      window.open(`${import.meta.env.VITE_API_URL}/uploads/${normalizedPath}`);
    }
  };

  const handleOpenDateModal = (data: MovementOrder) => {
    setOpenModal(data);
    setReceptionDate("");
  };

  const handleCloseModal = () => {
    setOpenModal(null);
    setReceptionDate("");
  };

  const handleAproveWithDate = async () => {
    if (!openModal) return;

    if (!receptionDate) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes seleccionar una fecha de recepción",
      });
      return;
    }

    try {
      await pendings.update({
        ...openModal,
        receptionDate: new Date(receptionDate),
        state: MovementOrderStatus.RECEIVED,
      });
      handleCloseModal();
      handleGetData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout
      title="Solicitudes / Pendientes"
      breadcrumb={[
        {
          label: "Solicitudes",
          href: "/panel/admin/solicitudes",
        },
        { label: "Pendientes", href: "/panel/admin/solicitudes/pendientes" },
      ]}
    >
      <div className="flex flex-col gap-3">
        {openModal && (
          <Modal
            title="Seleccionar Fecha de Recepción"
            onClose={handleCloseModal}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="reception-date" className="text-sm font-medium text-gray-700">
                  Fecha de recepción *
                </label>
                <input
                  id="reception-date"
                  type="date"
                  value={receptionDate}
                  onChange={(e) => setReceptionDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  min={new Date().toISOString().split("T")[0]}
                  placeholder="Selecciona una fecha"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="primary"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </Button>
                <Button type="primary" onClick={handleAproveWithDate}>
                  Aprobar Orden
                </Button>
              </div>
            </div>
          </Modal>
        )}
        <div className="flex justify-end">
          <Button type="primary" onClick={handleGetData}>
            <RefreshCw size={20} />
          </Button>
        </div>
        <Table
          columns={tableColumns(
            handleGetUser,
            handleViewExcel,
            handleViewRemittance,
            handleOpenDateModal
          )}
          data={pendings.data}
        />
      </div>
    </DashboardLayout>
  );
}

const tableColumns = (
  handleGetUser: (data: MovementOrder) => User | undefined,
  handleViewExcel: (data: MovementOrder) => void,
  handleViewRemittance: (data: MovementOrder) => void,
  handleOpenDateModal: (data: MovementOrder) => void
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
                <img className="w-full h-full object-cover" src={user.photo} alt={user.name || "Usuario"} />
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
          year: "2-digit",
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
              year: "2-digit",
            })
          : "-",
    },
    {
      header: "Acciones",
      key: "",
      render: (row: MovementOrder) => (
        <div className="flex gap-2 w-min">
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
              <div className="flex items-center gap-2">
                <Download size={18} /> Remito
              </div>
            </Button>
          )}
          {row.state === MovementOrderStatus.RECEIVED ? (
            <span className="flex justify-center gap-4 px-4 py-2 rounded-lg border text-secondary border-secondary">
              Aprobado
            </span>
          ) : (
            <Button type="primary" onClick={() => handleOpenDateModal(row)}>
              <Calendar size={18} />
              Aprobar
            </Button>
          )}
        </div>
      ),
    },
  ];
};
