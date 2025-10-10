import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../hooks/Auth/useAuth";
import Swal from "sweetalert2";

import Loading from "../Loading";
import HeaderSimple from "../Marketplace/Headers/HeaderSimple";
import Footer from "../Marketplace/Footer";
import SimpleSidebar from "./Sidebar/ClientSidebar";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ title, children }: Props) {
  const { loading, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que quieres cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await logout();
        navigate("/");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        Swal.fire("Error", "Error al cerrar sesión", "error");
      }
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex flex-col">
      <div className="flex flex-col min-h-screen">
        <HeaderSimple />
        <div className="flex flex-1 max-w-[1200px] w-full m-auto">
          <SimpleSidebar onLogout={handleLogout} />
          <div className="flex-1 p-8 max-w-4xl">
            <h1 className="mb-8 text-3xl font-bold text-gray-900">{title}</h1>
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
