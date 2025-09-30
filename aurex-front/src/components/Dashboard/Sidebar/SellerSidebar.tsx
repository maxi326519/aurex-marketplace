import Sidebar, { SideSection } from "./Sidebar";
import {
  User,
  ShoppingBag,
  Boxes,
  FilePlus2,
  ClipboardList,
  BarChart3,
  Store,
  TrendingUp,
  PackageSearch,
  Layers,
  FileInput,
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
        icon: <PackageSearch size={20} />,
        path: "/panel/vendedor/inventario",
        name: "Gestión de Inventario",
        sublist: [
          {
            icon: <Layers size={18} />,
            path: "/panel/vendedor/inventario/productos",
            name: "Todos los Productos",
          },
          {
            icon: <FileInput size={18} />,
            path: "/panel/vendedor/productos/importacion",
            name: "Ingreso Full",
          },
          {
            icon: <FilePlus2 size={18} />,
            path: "/panel/vendedor/inventario/nuevo-producto",
            name: "Agregar Producto",
          },
        ],
      },
    ],
  },
  {
    title: "Gestión Comercial",
    items: [
      {
        icon: <Store size={20} />,
        path: "/panel/vendedor/tienda",
        name: "Mi Tienda",
        sublist: [
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
            icon: <FilePlus2 size={18} />,
            path: "/panel/vendedor/tienda/alta-rapida",
            name: "Alta Rápida",
          },
        ],
      },
      {
        icon: <TrendingUp size={20} />,
        path: "/panel/vendedor/ventas",
        name: "Ventas",
        sublist: [
          {
            icon: <ClipboardList size={18} />,
            path: "/panel/vendedor/ventas/pedidos",
            name: "Pedidos",
          },
          /*           {
            icon: <BarChart3 size={18} />,
            path: "/panel/vendedor/ventas/estadisticas",
            name: "Estadísticas",
          }, */
        ],
      },
    ],
  },
  /*   {
    title: "Marketing",
    items: [
      {
        icon: <TrendingUp size={20} />,
        path: "/panel/vendedor/promociones",
        name: "Promociones",
      },
      {
        icon: <BarChart3 size={20} />,
        path: "/panel/vendedor/rendimiento",
        name: "Rendimiento",
      },
    ],
  }, */
];

export default function SelletSidebar() {
  return <Sidebar config={sections} />;
}
