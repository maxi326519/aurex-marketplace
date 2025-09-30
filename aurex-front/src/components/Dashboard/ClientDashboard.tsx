import Navbar from "./Navbar/Navbar";
import ClientSidebar from "./Sidebar/ClientSidebar";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ title, children }: Props) {
  return (
    <div className="flex w-screen h-screen">
      <ClientSidebar />
      <div className="grow flex flex-col bg-gray-200">
        <Navbar title={title} />
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
