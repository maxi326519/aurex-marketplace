import { BreadcrumbItem } from "./Breadcrumb";
import { useNavigate } from "react-router-dom";
import { UserStatus } from "../../interfaces/Users";
import { useEffect } from "react";
import { useAuth } from "../../hooks/Auth/useAuth";

import Navbar from "./Navbar/Navbar";
import SelletSidebar from "./Sidebar/SellerSidebar";
import Loading from "../Loading";

interface Props {
  title: string;
  children: React.ReactNode;
  requireActiveUser?: boolean;
  breadcrumb?: BreadcrumbItem[];
}

export default function DashboardLayout({
  title,
  children,
  requireActiveUser = false,
  breadcrumb = [],
}: Props) {
  const { loading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading]);

  return loading ? (
    <Loading />
  ) : (
    <div className="flex w-screen h-screen">
      <SelletSidebar />
      <div className="grow flex flex-col bg-gray-200">
        <Navbar
          title={title}
          breadcrumb={breadcrumb}
          homeHref="/panel/vendedor/dashboard"
        />
        {requireActiveUser && user && user.status !== UserStatus.ACTIVE ? (
          <div className="p-5 overflow-y-auto flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Estamos validando tu cuenta
                </h2>
                <p className="text-gray-600">
                  Tu cuenta está siendo revisada por nuestro equipo. Una vez
                  aprobada, podrás acceder a todas las funcionalidades.
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Mientras tanto, puedes actualizar tu perfil en la sección
                correspondiente.
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 pt-0 overflow-y-auto">{children}</div>
        )}
      </div>
    </div>
  );
}
