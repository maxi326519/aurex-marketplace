import { Download, RefreshCw, Store } from "lucide-react";
import { Reception, ReceptionStatus } from "../../../../interfaces/Receptions";
import { useEffect } from "react";
import { User } from "../../../../interfaces/Users";
import useReceptions from "../../../../hooks/Dashboard/receptions/useReceptions";
import useUsers from "../../../../hooks/Dashboard/users/useUsers";

import DashboardLayout from "../../../../components/Dashboard/AdminDashboard";
import Table from "../../../../components/Dashboard/Table/Table";
import Button from "../../../../components/ui/Button";
import Swal from "sweetalert2";

export default function ReceptionsPending() {
  const users = useUsers();
  const { pendings } = useReceptions();

  useEffect(() => {
    if (pendings.data.length === 0) handleGetData();
  }, []);

  const handleGetData = () => {
    pendings.get();
    users.get();
  };

  const handleGetUser = (reception: Reception): User | undefined => {
    return users.data.find((user) => user.id === reception.UserId);
  };

  const handleViewExcel = (data: Reception) => {
    window.open(`${import.meta.env.VITE_API_URL}/${data.sheetFile}`);
  };

  const handleViewRemittance = (data: Reception) => {
    window.open(`${import.meta.env.VITE_API_URL}/${data.remittance}`);
  };

  const handleAproveRemittance = (data: Reception) => {
    Swal.fire({
      title: "¿Estás seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) pendings.aprove(data);
    });
  };

  return (
    <DashboardLayout title="Recepciones / Pendientes">
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
            handleViewRemittance,
            handleAproveRemittance
          )}
          data={pendings.data}
        />
      </div>
    </DashboardLayout>
  );
}

const tableColumns = (
  handleGetUser: (data: Reception) => User | undefined,
  handleViewExcel: (data: Reception) => void,
  handleViewRemittance: (data: Reception) => void,
  handleAproveRemittance: (date: Reception) => void
) => {
  return [
    {
      header: "Vendedor",
      key: "",
      render: (row: Reception) => {
        const user = handleGetUser(row);

        return (
          <div className="flex items-center gap-4">
            <div className="flex justify-center items-center w-14 h-14 rounded-full border border-[#888] overflow-hidden">
              {user ? (
                <img className="w-full h-full object-cover" src={user.photo} />
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
      header: "Fecha",
      key: "date",
      render: (row: Reception) =>
        new Date(row.date).toLocaleString("es-CO", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
    },
    {
      header: "Acciones",
      key: "",
      render: (row: Reception) => (
        <div className="flex gap-2 w-min">
          <Button
            type="primary"
            variant="outline"
            onClick={() => handleViewExcel(row)}
          >
            <Download size={18} /> Excel
          </Button>
          <Button
            type="primary"
            variant="outline"
            onClick={() => handleViewRemittance(row)}
          >
            <div className="flex items-center gap-2">
              <Download size={18} /> Remito
            </div>
          </Button>
          {row.state === ReceptionStatus.RECEIVED ? (
            <span className="flex justify-center gap-4 px-4 py-2 rounded-lg border text-secondary border-secondary">
              Aprobado
            </span>
          ) : (
            <Button type="primary" onClick={() => handleAproveRemittance(row)}>
              Aprobar
            </Button>
          )}
        </div>
      ),
    },
  ];
};
