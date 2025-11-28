import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./hooks/Auth/useAuth";
import axios from "axios";

import Home from "./pages/index";
import Login from "./pages/login";
import Register from "./pages/registrarse";
import CompradorRegister from "./pages/registro/comprador";
import VendedorRegister from "./pages/registro/vendedor";
import Cart from "./pages/carrito";
import Pagos from "./pages/pagos";
import Search from "./pages/busqueda";
import ProductDetails from "./pages/ProductDetails";

/* Admin */
import DashboardPage from "./pages/panel/admin";
import UsersPage from "./pages/panel/admin/users";
import SellersPage from "./pages/panel/admin/sellers";
import ProductsListPage from "./pages/panel/admin/products/lists";
import ProductsImportsPage from "./pages/panel/admin/products/imports";
import LocationsPage from "./pages/panel/admin/storage/locations";
import InventarioPage from "./pages/panel/admin/storage/inventory";
import OrdersPage from "./pages/panel/admin/orders/orders";

/* Sellers */
import SellerAnaliticsPage from "./pages/panel/vendedores/analitics";
import SellerProfilePage from "./pages/panel/vendedores/perfil";
import SellersProductsPage from "./pages/panel/vendedores/inventario/productos";
import SellersOrdersPage from "./pages/panel/vendedores/inventario/solicitudes";
import SellersIngressPage from "./pages/panel/vendedores/inventario/ingreso";
import SellersEgressPage from "./pages/panel/vendedores/inventario/egreso";
import ImportProductsPage from "./pages/panel/vendedores/inventario/importar-productos";
import SellersPostsPage from "./pages/panel/vendedores/tienda/publicaciones";
import SellersProductsCombosPage from "./pages/panel/vendedores/tienda/combos";
import CreatePostPage from "./pages/panel/vendedores/tienda/crear-publicacion";
import SellersSalesPage from "./pages/panel/vendedores/tienda/ventas";

/* Clients */
import ClientsOrdersPage from "./pages/panel/compradores/compras";
import ComprasChatPage from "./pages/panel/compradores/compras-chat";
import CompradorPerfilPage from "./pages/panel/compradores/perfil";
import ReportePage from "./pages/panel/compradores/reporte";

import MovementOrdersApproved from "./pages/panel/admin/recepciones/aprobados";
import MovementOrdersHistory from "./pages/panel/admin/recepciones/historial";
import MovementOrdersPending from "./pages/panel/admin/recepciones/pendientes";

import "./App.css";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

function App() {
  const { reLogin } = useAuth();

  useEffect(() => {
    reLogin();
  }, []);

  return (
    <div className="h-screen bg-white">
      <Routes>
        {/* E-Commerce */}
        <Route path="/" element={<Home />} />
        <Route path="/busqueda" element={<Search />} />
        <Route path="/producto/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/registro/comprador" element={<CompradorRegister />} />
        <Route path="/registro/vendedor" element={<VendedorRegister />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/pagos" element={<Pagos />} />

        {/* Dashbpoard Admin */}
        <Route path={"/panel/admin/analiticas"} element={<DashboardPage />} />
        <Route path={"/panel/admin/usuarios"} element={<UsersPage />} />
        <Route path={"/panel/admin/vendedores"} element={<SellersPage />} />
        <Route
          path={"/panel/admin/productos/listado"}
          element={<ProductsListPage />}
        />
        <Route
          path={"/panel/admin/productos/importacion"}
          element={<ProductsImportsPage />}
        />
        <Route
          path={"/panel/admin/almacen/ubicaciones"}
          element={<LocationsPage />}
        />
        <Route
          path={"/panel/admin/almacen/inventario"}
          element={<InventarioPage />}
        />
        <Route path={"/panel/admin/pedidos"} element={<OrdersPage />} />

        <Route
          path={"/panel/admin/recepciones/pendientes"}
          element={<MovementOrdersPending />}
        />
        <Route
          path={"/panel/admin/recepciones/aprobados"}
          element={<MovementOrdersApproved />}
        />
        <Route
          path={"/panel/admin/recepciones/historial"}
          element={<MovementOrdersHistory />}
        />

        {/* Dashboard Sellers */}
        <Route
          path={"/panel/vendedor/analiticas"}
          element={<SellerAnaliticsPage />}
        />
        <Route
          path={"/panel/vendedor/perfil"}
          element={<SellerProfilePage />}
        />
        <Route
          path={"/panel/vendedor/inventario/productos"}
          element={<SellersProductsPage />}
        />
        <Route
          path={"/panel/vendedor/inventario/importar-productos"}
          element={<ImportProductsPage />}
        />
        <Route
          path={"/panel/vendedor/inventario/solicitudes"}
          element={<SellersOrdersPage />}
        />
        <Route
          path={"/panel/vendedor/inventario/solicitudes/ingreso"}
          element={<SellersIngressPage />}
        />
        <Route
          path={"/panel/vendedor/inventario/solicitudes/egreso"}
          element={<SellersEgressPage />}
        />
        <Route
          path={"/panel/vendedor/tienda/publicaciones"}
          element={<SellersPostsPage />}
        />
        <Route
          path={"/panel/vendedor/tienda/crear-publicacion"}
          element={<CreatePostPage />}
        />
        <Route
          path={"/panel/vendedor/tienda/combos"}
          element={<SellersProductsCombosPage />}
        />
        <Route
          path={"/panel/vendedor/tienda/pedidos"}
          element={<SellersSalesPage />}
        />

        {/* Dashboard Compradores */}
        <Route path={"/panel/compras"} element={<ClientsOrdersPage />} />
        <Route
          path={"/panel/compras/chat/:chatId"}
          element={<ComprasChatPage />}
        />
        <Route path={"/panel/perfil"} element={<CompradorPerfilPage />} />
        <Route path={"/panel/reporte/:orderId"} element={<ReportePage />} />
      </Routes>
    </div>
  );
}

export default App;
