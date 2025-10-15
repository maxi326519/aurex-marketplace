import { Pencil, Trash2, CheckCircle, Ban } from "lucide-react";
import { User, UserRol, UserStatus } from "../../../interfaces/Users";
import { useEffect, useState } from "react";
import useSellers from "../../../hooks/Dashboard/sellers/useSellers";
import Swal from "sweetalert2";

import DashboardLayout from "../../../components/Dashboard/AdminDashboard";
import Table from "../../../components/Dashboard/Table/Table";
import UserForm from "../../../components/Dashboard/Forms/UserForm";
import Controls from "../../../components/Dashboard/Controls/Controls";
import UserStatusModal from "../../../components/Dashboard/Modals/UserStatusModal";

const tableColumns = (
  handleEdit: (data: User) => void,
  handleDelete: (data: User) => void,
  handleEnable: (data: User) => void,
  handleBlock: (data: User) => void
) => [
  { header: "Nombre", key: "name" },
  { header: "Email", key: "email" },
  {
    header: "Estado",
    key: "status",
    render: (row: User) => {
      const statusColors: Record<UserStatus, string> = {
        [UserStatus.WAITING]: "bg-yellow-100 text-yellow-600",
        [UserStatus.ACTIVE]: "bg-blue-100 text-blue-600",
        [UserStatus.BLOCKED]: "bg-red-100 text-red-600",
      };

      return (
        <span
          className={`px-2 py-1 rounded-md text-sm font-medium ${
            statusColors[row.status]
          }`}
        >
          {row.status}
        </span>
      );
    },
  },
  {
    header: "Acciones",
    key: "actions",
    render: (row: User) => (
      <div className="flex gap-2">
        {row.status !== UserStatus.ACTIVE && (
          <button
            type="button"
            title="Habilitar Usuario"
            aria-label="Habilitar Usuario"
            onClick={() => handleEnable(row)}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm font-medium"
          >
            <CheckCircle className="h-4 w-4 inline mr-1" />
            Habilitar
          </button>
        )}
        {row.status !== UserStatus.BLOCKED && (
          <button
            type="button"
            title="Bloquear Usuario"
            aria-label="Bloquear Usuario"
            onClick={() => handleBlock(row)}
            className="px-3 py-1 rounded-md text-red-500 hover:text-white hover:bg-red-600 transition text-sm font-medium"
          >
            <Ban className="h-4 w-4  inline mr-1" />
          </button>
        )}
        <button
          type="button"
          title="Editar"
          aria-label="Editar"
          onClick={() => handleEdit(row)}
          className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
        >
          <Pencil className="h-4 w-4 text-gray-600" />
        </button>
        <button
          type="button"
          title="Eliminar"
          aria-label="Eliminar"
          onClick={() => handleDelete(row)}
          className="p-2 rounded-full border border-red-300 hover:bg-red-100 transition"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>
    ),
  },
];

export default function SellersPage() {
  const sellers = useSellers();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isEnableModalOpen, setIsEnableModalOpen] = useState<boolean>(false);
  const [userToEnable, setUserToEnable] = useState<User | null>(null);

  useEffect(() => {
    sellers.get();
  }, []);

  const handleNewUser = () => {
    setIsOpen(true);
  };

  const handleReload = () => {
    sellers.get();
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const handleSubmit = async (user: User, file?: File | null) => {
    console.log("Submit:", selectedUser, user);

    if (selectedUser) {
      sellers.update(user).then(() => {
        setIsOpen(false);
        setSelectedUser(undefined);
      });
    } else {
      sellers.create(user, file).then(() => {
        setIsOpen(false);
        setSelectedUser(undefined);
      });
    }
  };

  const handleDelete = (user: User) => {
    console.log("Eliminar:", user);
    sellers.delete(user.id!);
  };

  const handleEnable = (user: User) => {
    setUserToEnable(user);
    setIsEnableModalOpen(true);
  };

  const handleBlock = async (user: User) => {
    const result = await Swal.fire({
      title: "¿Bloquear usuario?",
      text: `¿Estás seguro de que quieres bloquear a ${user.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, bloquear",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const userToUpdate = sellers.data.find((u) => u.id === user.id);
      if (userToUpdate) {
        const updatedUser = { ...userToUpdate, status: UserStatus.BLOCKED };
        await sellers.update(updatedUser);
        Swal.fire(
          "Bloqueado",
          "El usuario ha sido bloqueado exitosamente.",
          "success"
        );
      }
    }
  };

  const handleEnableUser = async (userId: string) => {
    const userToUpdate = sellers.data.find((user) => user.id === userId);
    if (userToUpdate) {
      const updatedUser = { ...userToUpdate, status: UserStatus.ACTIVE };
      await sellers.update(updatedUser);
    }
  };

  return (
    <DashboardLayout title="Vendedores">
      {isOpen && (
        <UserForm
          data={selectedUser}
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
      {isEnableModalOpen && (
        <UserStatusModal
          onClose={() => {
            setIsEnableModalOpen(false);
            setUserToEnable(null);
          }}
          user={userToEnable}
          onEnableUser={handleEnableUser}
        />
      )}
      <div className="flex flex-col gap-2">
        <Controls
          data={sellers.data}
          btnConfig={[
            {
              label: "Recargar",
              onClick: handleReload,
            },
            {
              label: "Nuevo Vendedor",
              onClick: handleNewUser,
            },
          ]}
        />
        <Table
          columns={tableColumns(
            handleOpenEdit,
            handleDelete,
            handleEnable,
            handleBlock
          )}
          data={sellers.data.filter((seller) => seller.rol === UserRol.SELLER)}
        />
      </div>
    </DashboardLayout>
  );
}
