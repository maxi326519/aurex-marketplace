import { RefreshCw, Store } from "lucide-react";
import { Reception } from "../../../../interfaces/Receptions";
import { useEffect } from "react";
import { User } from "../../../../interfaces/Users.ts";
import useReceptions from "../../../../hooks/Dashboard/receptions/useReceptions";
import useUsers from "../../../../hooks/Dashboard/users/useUsers";

import DashboardLayout from "../../../../components/Dashboard/AdminDashboard";
import Table from "../../../../components/Dashboard/Table/Table";
import Button from "../../../../components/ui/Button";

export default function ReceptionsHistory() {
  const users = useUsers();
  const { history } = useReceptions();

  useEffect(() => {
    if (history.data.length === 0) handleGetData();
  }, []);

  const handleGetData = () => {
    history.get();
  };

  const handleGetUser = (reception: Reception): User | undefined => {
    return users.data.find((user) => user.id === reception.UserId);
  };

  return (
    <DashboardLayout title="Recepciones / Historial">
      <div className="flex flex-col gap-3">
        <div className="flex justify-end">
          <Button type="primary" onClick={handleGetData}>
            <RefreshCw size={20} />
          </Button>
        </div>
        <Table columns={tableColumns(handleGetUser)} data={history.data} />
      </div>
    </DashboardLayout>
  );
}

const tableColumns = (handleGetUser: (row: Reception) => User | undefined) => {
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
      header: "Tipo",
      key: "type",
    },
    /* TODO: Mostrar ingreso parcial */
    {
      header: "Excel",
      key: "",
      render: () => <Button type="primary">Subir</Button>,
    },
  ];
};
