import Sidebar, { SideSection } from "./Sidebar";
import { Clock } from "lucide-react";

const sections: SideSection[] = [
  {
    title: "Compras",
    requiredRole: ["admin", "manager", "purchasing"],
    items: [
      {
        icon: <Clock size={20} />,
        path: "/panel/compras",
        name: "Pedidos",
      },
    ],
  },
];

export default function ClientSidebar() {
  return <Sidebar config={sections} />;
}
