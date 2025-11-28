import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStorage } from "../../../../hooks/Dashboard/storage/useStorage";
import { Plus, Eye } from "lucide-react";
import { Storage } from "../../../../interfaces/Storage";
import usePagination from "../../../../hooks/Dashboard/usePagination";

import DashboardLayout from "../../../../components/Dashboard/AdminDashboard";
import Button from "../../../../components/ui/Button";
import Table from "../../../../components/Dashboard/Table/Table";
import Pagination from "../../../../components/Dashboard/Table/Pagination/Pagination";
import StorageForm from "../../../../components/Dashboard/Forms/StorageForm";

const tableColumns = (handleViewStock: (storage: Storage) => void) => [
  { header: "Rag", key: "rag" },
  { header: "Frente", key: "site" },
  { header: "Posiciones Totales", key: "position" },
  { header: "Capacidad Actual", key: "currentCapacity" },
  { header: "Capacidad estimada", key: "estimatedCapacity" },
  {
    header: "Acciones",
    key: "actions",
    render: (row: Storage) => (
      <button
        title="Ver stock"
        onClick={() => handleViewStock(row)}
        className="p-2 rounded-full border border-blue-300 hover:bg-blue-100 transition"
      >
        <Eye className="h-4 w-4 text-blue-600" />
      </button>
    ),
  },
];

export default function LocationsPage() {
  const navigate = useNavigate();
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

  const handleViewStock = (storage: Storage) => {
    if (storage.id) {
      navigate(`/panel/admin/almacen/inventario?storageId=${storage.id}`);
    }
  };

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
        <Table columns={tableColumns(handleViewStock)} data={pagination.rows} />
        <Pagination page={pagination.page} setPage={pagination.setPage} />
      </div>
    </DashboardLayout>
  );
}
