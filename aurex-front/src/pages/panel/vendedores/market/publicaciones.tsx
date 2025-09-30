import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import usePosts from "../../../../hooks/Dashboard/posts/usePosts";

import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import Table from "../../../../components/Dashboard/Table/Table";
import Button from "../../../../components/ui/Button";

const tableColumns = [
  { header: "ID Publicación", key: "id" },
  { header: "Título", key: "title" },
  { header: "Producto", key: "product.name" },
  { header: "SKU", key: "product.sku" },
  { header: "Precio", key: "price" },
  { header: "Stock", key: "product.totalStock" },
  { header: "Estado", key: "product.status" },
  { header: "Clicks", key: "clicks" },
  { header: "Fecha", key: "date" },
];

export default function SellersPostsPage() {
  const navigate = useNavigate();
  const posts = usePosts();

  useEffect(() => {
    posts.get();
  }, []);

  useEffect(() => {
    console.log("Publicaciones", posts.data);
  }, [posts.data]);

  const handleCreatePost = () => {
    navigate("/panel/vendedor/tienda/crear-publicacion");
  };

  return (
    <DashboardLayout title="Tienda / Publicaciones">
      <div className="flex flex-col gap-4">
        {/* Header con botón de crear */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Mis Publicaciones
            </h1>
            <p className="text-gray-600">
              Gestiona las publicaciones de tus productos
            </p>
          </div>
          <Button type="primary" onClick={handleCreatePost}>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Crear Publicación
          </Button>
        </div>

        {/* Tabla de publicaciones */}
        <div className="bg-white rounded-lg shadow">
          {posts.loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">
                Cargando publicaciones...
              </span>
            </div>
          ) : posts.data.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes publicaciones
              </h3>
              <p className="text-gray-500 mb-4">
                Crea tu primera publicación para comenzar a vender
              </p>
              <Button type="primary" onClick={handleCreatePost}>
                Crear Primera Publicación
              </Button>
            </div>
          ) : (
            <Table columns={tableColumns} data={posts.data} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
