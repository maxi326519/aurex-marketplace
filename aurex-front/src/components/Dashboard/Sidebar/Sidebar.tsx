import { LogOut, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logoPng from "../../../assets/img/logos/logo-white-transparent.png";
import { useAuth } from "../../../hooks/Auth/useAuth";

export interface SideSection {
  title?: string;
  items: SideItem[];
  requiredRole?: string[];
}

export interface SideItem {
  icon: React.ReactNode;
  path: string;
  name: string;
  requiredRole?: string[];
  sublist?: Array<{
    icon: React.ReactNode;
    path: string;
    name: string;
    requiredRole?: string[];
  }>;
}

interface Props {
  config: SideSection[];
}

export default function Sidebar({ config }: Props) {
  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );
  const [userRole, setUserRole] = useState("manager");

  useEffect(() => {
    setUserRole("manager");
  }, []);

  // Initialize expanded menus based on current path
  useEffect(() => {
    const newExpandedMenus: Record<string, boolean> = {};

    config.forEach((section) => {
      section.items.forEach((item) => {
        if (item.sublist) {
          const isSubItemActive = item.sublist.some((subItem) =>
            location.pathname.startsWith(subItem.path)
          );
          if (isSubItemActive) {
            newExpandedMenus[item.path] = true;
          }
        }
      });
    });

    setExpandedMenus(newExpandedMenus);
  }, [location.pathname]);

  const handleLogOut = () => {
    auth.logout().finally(() => navigate("/"));
  };

  const toggleMenu = (path: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const isItemActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const isSubItemActive = (path: string) => {
    return location.pathname === path;
  };

  const hasPermission = (requiredRoles?: string[]) => {
    if (!requiredRoles) return true;
    return requiredRoles.includes(userRole);
  };

  return (
    <div className="flex flex-col w-64 h-full bg-primary-900 text-gray-200">
      <div className="flex items-center justify-center h-navbar border-b border-gray-700">
        <img className="w-[200px]" src={logoPng} alt="Logo" />
      </div>

      <div className="flex-1 flex flex-col gap-4 p-2 overflow-y-auto">
        {config.map((section) => {
          if (!hasPermission(section.requiredRole)) return null;

          const filteredItems = section.items.filter((item) =>
            hasPermission(item.requiredRole)
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={section.title}>
              {section.title && (
                <div className="p-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {section.title}
                </div>
              )}

              {filteredItems.map((item) => (
                <div key={item.path} className="mb-1">
                  {item.sublist ? (
                    <>
                      <div
                        className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-secondary-600 transition-colors ${
                          isItemActive(item.path) ? "bg-primary-800" : ""
                        }`}
                        onClick={() => toggleMenu(item.path)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="icon">{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                        {expandedMenus[item.path] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </div>

                      <div
                        className={`flex flex-col gap-2 overflow-hidden transition-all duration-200 ${
                          expandedMenus[item.path] ? "max-h-96 py-2" : "max-h-0"
                        }`}
                      >
                        {item.sublist
                          .filter((subItem) =>
                            hasPermission(subItem.requiredRole)
                          )
                          .map((subItem) => (
                            <Link
                              to={subItem.path}
                              key={subItem.path}
                              className={`flex items-center gap-3 ml-6 py-2 px-3 text-sm rounded-md ${
                                isSubItemActive(subItem.path)
                                  ? "bg-secondary text-primary"
                                  : "hover:bg-secondary-600 text-gray-200"
                              }`}
                            >
                              <span className="icon">{subItem.icon}</span>
                              <span>{subItem.name}</span>
                            </Link>
                          ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 p-2 rounded-md ${
                        isItemActive(item.path)
                          ? "bg-secondary text-primary font-medium"
                          : "hover:bg-secondary-600 text-gray-200"
                      }`}
                    >
                      <span className="icon">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          className="flex items-center gap-3 w-full p-2 rounded hover:bg-gray-700 transition-colors"
          onClick={handleLogOut}
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
