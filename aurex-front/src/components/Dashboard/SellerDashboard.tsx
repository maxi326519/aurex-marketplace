import Navbar from "./Navbar/Navbar";
import SelletSidebar from "./Sidebar/SellerSidebar";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ title, children }: Props) {
  return (
    <div className="flex w-screen h-screen">
      <SelletSidebar />
      <div className="grow flex flex-col bg-gray-200">
        <Navbar title={title} />
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
