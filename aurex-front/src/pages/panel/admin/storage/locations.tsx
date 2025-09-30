import { useEffect, useState } from "react";
import { useStorage } from "../../../../hooks/Dashboard/storage/useStorage";
import { Storage } from "../../../../interfaces/Storage";
import { Plus } from "lucide-react";
import usePagination from "../../../../hooks/Dashboard/usePagination";

import DashboardLayout from "../../../../components/Dashboard/AdminDashboard";
import Button from "../../../../components/ui/Button";
import Table from "../../../../components/Dashboard/Table/Table";
import Pagination from "../../../../components/Dashboard/Table/Pagination/Pagination";
import StorageForm from "../../../../components/Dashboard/Forms/StorageForm";

const tableColumns = [
  { header: "Rag", key: "rag" },
  { header: "Frente", key: "site" },
  { header: "Posiciones Totales", key: "position" },
  { header: "Capacidad Actual", key: "currentCapacity" },
  { header: "Capacidad estimada", key: "estimatedCapacity" },
  // { header: "Cantidad permitida", key: "allowedQuantity" },
  /*   {
    header: "Ocupación",
    key: "",
    render: (row: Storage) => {
      const percentage = Math.min(
        100,
        Math.round((row.currentCapacity / row.estimatedCapacity) * 100)
      );
      return (
        <div className="w-full bg-gray-200 h-4 rounded">
          <div
            className={`h-4 rounded ${
              percentage > 80
                ? "bg-red-500"
                : percentage > 50
                ? "bg-yellow-400"
                : "bg-green-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      );
    },
  }, */
];

export default function LocationsPage() {
  const storages = useStorage();
  const pagination = usePagination(storages.data);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Storage>();

  useEffect(() => {
    if (storages.data.length === 0) handleGetData();
  }, []);

  const handleGetData = () => {
    storages.get();
  };

  const handleOpenForm = () => {
    setIsOpen(true);
  };

  const handleCloseForm = () => {
    setIsOpen(false);
    setSelected(undefined);
  };

  const handleSubmit = async (data: Storage) => {
    if (selected) {
      storages.update(data).then(() => {
        setIsOpen(false);
        setSelected(undefined);
      });
    } else {
      storages.set(data).then(() => {
        setIsOpen(false);
        setSelected(undefined);
      });
    }
  };

  // const handleOpenEdit = (data: Storage) => {
  //   setSelected(data);
  //   setIsOpen(true);
  // };

  // const handleDelete = (data: Storage) => {
  //   storages.remove(data.id!);
  // };

  return (
    <DashboardLayout title="Almacén / Ubicaciones">
      {/* FORM */}
      {isOpen && (
        <StorageForm
          data={selected}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
        />
      )}

      {/* CONTROLS */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <Button type="primary" onClick={handleGetData}>
            Recargar
          </Button>
          <Button
            className="flex items-center gap-2"
            type="primary"
            onClick={handleOpenForm}
          >
            <Plus size={20} />
            <span>Agregar</span>
          </Button>
        </div>

        {/* TABLE */}
        <Table columns={tableColumns} data={pagination.rows} />
        <Pagination page={pagination.page} setPage={pagination.setPage} />
      </div>
    </DashboardLayout>
  );
}
