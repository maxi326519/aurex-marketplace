import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../hooks/Auth/useAuth";

import Loading from "../Loading";
import Navbar from "./Navbar/Navbar";
import AdminSidebar from "./Sidebar/AdminSidebar";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ title, children }: Props) {
  const { loading, isAuthenticated } = useAuth();
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
      <AdminSidebar />
      <div className="grow flex flex-col h-full bg-gray-200">
        <Navbar title={title} />
        <div className="p-5 h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
