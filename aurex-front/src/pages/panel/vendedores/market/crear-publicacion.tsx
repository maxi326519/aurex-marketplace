import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Post } from "../../../../interfaces/Posts";

import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import CreatePostForm from "../../../../components/Dashboard/Forms/CreatePostForm";
import usePosts from "../../../../hooks/Dashboard/posts/usePosts";

export default function CrearPublicacionPage() {
  const navigate = useNavigate();
  const posts = usePosts();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = (post: Post, files?: File[]) => {
    posts.create(post, files).finally(() => {
      setShowSuccess(true);
      navigate("/panel/vendedor/tienda/publicaciones");
    });
  };

  const handleCancel = () => {
    navigate("/panel/vendedor/tienda/publicaciones");
  };

  if (showSuccess) {
    return (
      <DashboardLayout title="Tienda / Crear Publicación">
        <div className="flex flex-col items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Publicación Creada!
            </h2>
            <p className="text-gray-600 mb-4">
              Tu publicación se ha creado exitosamente.
            </p>
            <p className="text-sm text-gray-500">
              Redirigiendo a la lista de publicaciones...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Tienda / Crear Publicación">
      <div className="flex flex-col gap-6">
        {/* Formulario */}
        <CreatePostForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </DashboardLayout>
  );
}
