import Navbar from "./Navbar/Navbar";
import AdminSidebar from "./Sidebar/AdminSidebar";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ title, children }: Props) {
  return (
    <div className="flex w-screen h-screen">
      <AdminSidebar />
      <div className="grow flex flex-col h-full bg-gray-200">
        <Navbar title={title} />
        <div className="p-5 h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
