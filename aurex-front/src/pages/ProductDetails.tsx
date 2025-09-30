import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Post } from "../interfaces/Posts";
import usePosts from "../hooks/Dashboard/posts/usePosts";
import useCartStore from "../hooks/Store/useCarrito";
import Header from "../components/Marketplace/Header";
import Footer from "../components/Marketplace/Footer";

// Imágenes de stock para testing
const stockImages = [
  "https://picsum.photos/600/600?random=1",
  "https://picsum.photos/600/600?random=2",
  "https://picsum.photos/600/600?random=3",
  "https://picsum.photos/600/600?random=4",
  "https://picsum.photos/600/600?random=5",
];

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const posts = usePosts();
  const { addItem } = useCartStore();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const fetchedPost = await posts.getById(id);
        const parsedImages = fetchedPost.images
          ? JSON.parse((fetchedPost.images as any) as string)
          : [];
        const images = parsedImages.length > 0 ? parsedImages : stockImages;

        const data = {
          ...fetchedPost,
          images,
          otherFeatures: fetchedPost.otherFeatures
            ? JSON.parse((fetchedPost.otherFeatures as any) as string)
            : [],
          faq: fetchedPost.faq
            ? JSON.parse((fetchedPost.faq as any) as string)
            : [],
          price: Number(fetchedPost.price),
        };

        console.log("Fetched post:", data);
        setPost(data);
      } catch (err) {
        setError("Error al cargar el producto");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleAddToCart = () => {
    if (post) {
      addItem(post);
      alert("Producto agregado al carrito");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error || "Producto no encontrado"}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="lg:flex">
            {/* Galería de Imágenes */}
            <div className="lg:w-1/2 p-6">
              <div className="flex flex-col">
                {/* Imagen principal */}
                <div className="mb-4">
                  <img
                    src={post.images[selectedImage]}
                    alt={`Imagen principal ${selectedImage + 1}`}
                    className="w-full h-96 object-cover rounded-lg shadow-md"
                  />
                </div>
                {/* Miniaturas */}
                <div className="flex space-x-2 overflow-x-auto">
                  {post.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Información del producto */}
            <div className="lg:w-1/2 p-6">
              {/* Estado del producto */}
              <div className="mb-4">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                  {post.status}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              {/* Precio y cuotas */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ${post.price.toFixed(2)}
                </div>
                {post.sixInstallments && (
                  <p className="text-sm text-gray-600">
                    en 6 cuotas de ${(post.price / 6).toFixed(2)} sin interés
                  </p>
                )}
                {post.twelveInstallments && (
                  <p className="text-sm text-gray-600">
                    en 12 cuotas de ${(post.price / 12).toFixed(2)} sin interés
                  </p>
                )}
              </div>

              {/* Botón de compra */}
              <div className="mb-6">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg mb-3"
                >
                  Agregar al carrito
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Volver
                </button>
              </div>

              {/* Información del vendedor/producto */}
              {post.product && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Información del producto</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">SKU:</span> {post.product.sku}</p>
                    <p><span className="font-medium">Categoría:</span> {post.product.category1} - {post.product.category2}</p>
                    <p><span className="font-medium">Stock disponible:</span> {post.product.totalStock}</p>
                  </div>
                </div>
              )}

              {/* Descripción */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                <p className="text-gray-700">{post.content}</p>
              </div>

              {/* Características */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Características principales</h2>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">Marca</span>
                    <span>{post.brand || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">Modelo</span>
                    <span>{post.model || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">Tipo</span>
                    <span>{post.type || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">Color</span>
                    <span>{post.color || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">Volumen</span>
                    <span>{post.volume || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">Dimensiones</span>
                    <span>{post.dimensions || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Otras características */}
              {post.otherFeatures && post.otherFeatures.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Otras características</h2>
                  <div className="space-y-2 text-sm">
                    {post.otherFeatures.map((feature, index) => (
                      <div key={index} className="flex justify-between py-1 border-b">
                        <span className="font-medium">{feature.name}</span>
                        <span>{feature.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preguntas Frecuentes */}
              {post.faq && post.faq.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Preguntas y respuestas</h2>
                  <div className="space-y-3">
                    {post.faq.map((item, index) => (
                      <div key={index} className="border rounded p-3">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-gray-700 text-sm mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
