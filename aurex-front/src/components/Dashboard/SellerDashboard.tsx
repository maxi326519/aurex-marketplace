import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../hooks/Auth/useAuth";

import Navbar from "./Navbar/Navbar";
import SelletSidebar from "./Sidebar/SellerSidebar";
import Loading from "../Loading";

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
      <SelletSidebar />
      <div className="grow flex flex-col bg-gray-200">
        <Navbar title={title} />
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
