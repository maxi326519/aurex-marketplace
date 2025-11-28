import Sidebar, { SideSection } from "./Sidebar";
import {
  User,
  ShoppingBag,
  Boxes,
  ClipboardList,
  BarChart3,
  Package,
  Archive,
  Inbox,
  PackagePlus,
  PackageMinus,
} from "lucide-react";

const sections: SideSection[] = [
  {
    title: "General",
    items: [
      {
        icon: <BarChart3 size={20} />,
        path: "/panel/vendedor/analiticas",
        name: "Analíticas",
      },
      {
        icon: <User size={20} />,
        path: "/panel/vendedor/perfil",
        name: "Perfil",
      },
    ],
  },
  {
    title: "Inventario",
    items: [
      {
        icon: <Package size={18} />,
        path: "/panel/vendedor/inventario/productos",
        name: "Productos",
        sublist: [
          {
            icon: <Archive size={16} />,
            path: "/panel/vendedor/inventario/productos",
            name: "Todos los productos",
          },
          {
            icon: <PackagePlus size={18} />, // Cambia el icono a uno que indique "importar/agregar"
            path: "/panel/vendedor/inventario/importar-productos",
            name: "Importar Productos",
          },
        ],
      },
      {
        icon: <Inbox size={18} />,
        path: "/panel/vendedor/inventario/solicitudes",
        name: "Solicitudes",
        sublist: [
          {
            icon: <Archive size={16} />,
            path: "/panel/vendedor/inventario/solicitudes",
            name: "Todas las solicitudes",
          },
          {
            icon: <PackagePlus size={16} />,
            path: "/panel/vendedor/inventario/solicitudes/ingreso",
            name: "Ingreso de inventario",
          },
          {
            icon: <PackageMinus size={16} />,
            path: "/panel/vendedor/inventario/solicitudes/egreso",
            name: "Egreso de inventario",
          },
        ],
      },
    ],
  },
  {
    title: "Tienda",
    items: [
      {
        icon: <ShoppingBag size={18} />,
        path: "/panel/vendedor/tienda/publicaciones",
        name: "Publicaciones",
      },
      {
        icon: <Boxes size={18} />,
        path: "/panel/vendedor/tienda/combos",
        name: "Combos y Promos",
      },
      {
        icon: <ClipboardList size={18} />,
        path: "/panel/vendedor/tienda/pedidos",
        name: "Pedidos",
      },
    ],
  },
];

export default function SelletSidebar() {
  return <Sidebar config={sections} />;
}
