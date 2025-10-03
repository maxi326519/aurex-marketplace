import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/Auth/useAuth";

import Navbar from "./Navbar/Navbar";
import ClientSidebar from "./Sidebar/ClientSidebar";
import { useEffect } from "react";
import Loading from "../Loading";
import HeaderSimple from "../Marketplace/Headers/HeaderSimple";
import Footer from "../Marketplace/Footer";

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
      <HeaderSimple />
      <ClientSidebar />
      <div className="grow flex flex-col bg-gray-200">
        <Navbar title={title} />
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
