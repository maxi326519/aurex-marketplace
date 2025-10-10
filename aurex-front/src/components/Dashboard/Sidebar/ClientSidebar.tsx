import { User, ShoppingBag, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SimpleSidebarProps {
  className?: string;
  onLogout?: () => void;
}

export default function SimpleSidebar({
  className = "",
  onLogout,
}: SimpleSidebarProps) {
  const location = useLocation();

  const menuItems = [
    {
      icon: <User size={20} />,
      path: "/panel/perfil",
      name: "Perfil",
    },
    {
      icon: <ShoppingBag size={20} />,
      path: "/panel/compras",
      name: "Compras",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 w-64 flex flex-col ${className}`}
    >
      <div className="p-6 flex-1">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Mi Cuenta</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
