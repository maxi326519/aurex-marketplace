import { User, UserRol, UserStatus } from "../../../interfaces/Users";
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import useUsers from "../../../hooks/Dashboard/users/useUsers";

import DashboardLayout from "../../../components/Dashboard/AdminDashboard";
import Table from "../../../components/Dashboard/Table/Table";
import UserForm from "../../../components/Dashboard/Forms/UserForm";
import Controls from "../../../components/Dashboard/Controls/Controls";

const tableColumns = (
  handleEdit: (data: User) => void,
  handleDelete: (data: User) => void
) => [
  { header: "Nombre", key: "name" },
  { header: "Email", key: "email" },
  {
    header: "Rol",
    key: "rol",
    render: (row: User) => {
      const rolColors: Record<UserRol, string> = {
        [UserRol.ADMIN]: "bg-purple-100 text-purple-800",
        [UserRol.DISPACHER]: "bg-blue-100 text-blue-800",
        [UserRol.SELLER]: "bg-green-100 text-green-800",
        [UserRol.CLIENT]: "bg-yellow-100 text-yellow-800",
      };

      return (
        <span
          className={`px-2 py-1 rounded-md text-sm font-medium ${
            rolColors[row.rol]
          }`}
        >
          {row.rol}
        </span>
      );
    },
  },
  {
    header: "Estado",
    key: "status",
    render: (row: User) => {
      const statusColors: Record<UserStatus, string> = {
        [UserStatus.WAITING]: "bg-yellow-100 text-yellow-600",
        [UserStatus.ACTIVE]: "bg-green-100 text-green-600",
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
        <button
          onClick={() => handleEdit(row)}
          className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
        >
          <Pencil className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={() => handleDelete(row)}
          className="p-2 rounded-full border border-red-300 hover:bg-red-100 transition"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>
    ),
  },
];

export default function UsersPage() {
  const users = useUsers();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User>();

  useEffect(() => {
    users.get();
  }, []);

  const handleNewUser = () => {
    setIsOpen(true);
  };

  const handleReload = () => {
    users.get();
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const handleSubmit = async (user: User, file?: File | null) => {
    console.log("Submit:", selectedUser, user);

    if (selectedUser) {
      users.update(user).then(() => {
        setIsOpen(false);
        setSelectedUser(undefined);
      });
    } else {
      users.create(user, file).then(() => {
        setIsOpen(false);
        setSelectedUser(undefined);
      });
    }
  };

  const handleDelete = (user: User) => {
    console.log("Eliminar:", user);
    users.delete(user.id!);
  };

  return (
    <DashboardLayout title="Usuarios">
      {isOpen && (
        <UserForm
          data={selectedUser}
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
      <div className="flex flex-col gap-2">
        <Controls
          data={users.data}
          btnConfig={[
            {
              label: "Recargar",
              onClick: handleReload,
            },
            {
              label: "Nuevo Admin",
              onClick: handleNewUser,
            },
          ]}
        />
        <Table
          columns={tableColumns(handleOpenEdit, handleDelete)}
          data={users.data.filter((user) => user.rol === UserRol.ADMIN)}
        />
      </div>
    </DashboardLayout>
  );
}
