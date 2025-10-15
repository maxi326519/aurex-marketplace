import { useState, useEffect } from "react";
import { OrderManagement } from "../../../interfaces/OrderManagement";
import { Star } from "lucide-react";
import useReviews from "../../../hooks/Dashboard/reviews/useReviews";
import Modal from "../../Modal";
import Button from "../../ui/Button";

interface ReviewData {
  orderItemId: string;
  postId: string;
  score: number;
  title: string;
  description: string;
}

interface Props {
  order: OrderManagement | null;
  onClose: () => void;
}

export default function ReviewModal({ order, onClose }: Props) {
  const reviews = useReviews();
  const [reviewsData, setReviewsData] = useState<ReviewData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReviews, setSubmittedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (order) {
      // Inicializar datos de reseñas para cada item
      const initialReviews = order.items.map((item) => ({
        orderItemId: item.id,
        postId: item.product.id, // Asumiendo que el producto tiene un ID de post
        score: 0,
        title: "",
        description: "",
      }));
      setReviewsData(initialReviews);
    }
  }, [order]);

  const handleScoreChange = (orderItemId: string, score: number) => {
    setReviewsData((prev) =>
      prev.map((review) =>
        review.orderItemId === orderItemId ? { ...review, score } : review
      )
    );
  };

  const handleTitleChange = (orderItemId: string, title: string) => {
    setReviewsData((prev) =>
      prev.map((review) =>
        review.orderItemId === orderItemId ? { ...review, title } : review
      )
    );
  };

  const handleDescriptionChange = (
    orderItemId: string,
    description: string
  ) => {
    setReviewsData((prev) =>
      prev.map((review) =>
        review.orderItemId === orderItemId ? { ...review, description } : review
      )
    );
  };

  const handleSubmitIndividual = async (orderItemId: string) => {
    if (!order) return;

    const reviewData = reviewsData.find((r) => r.orderItemId === orderItemId);
    if (!reviewData || reviewData.score === 0) {
      alert("Por favor, califica el producto antes de enviar");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviews.createReview(
        reviewData.score,
        `${reviewData.title}\n\n${reviewData.description}`,
        reviewData.postId
      );

      // Marcar como enviado
      setSubmittedReviews(prev => new Set([...prev, orderItemId]));
      
      // Limpiar los datos de este producto
      setReviewsData(prev =>
        prev.map((review) =>
          review.orderItemId === orderItemId
            ? { ...review, score: 0, title: "", description: "" }
            : review
        )
      );

    } catch (error) {
      console.error("Error creating review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (orderItemId: string, currentScore: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleScoreChange(orderItemId, star)}
            title={`Calificar con ${star} estrella${star !== 1 ? "s" : ""}`}
            className={`p-1 transition-colors ${
              star <= currentScore
                ? "text-yellow-400 hover:text-yellow-500"
                : "text-gray-300 hover:text-yellow-400"
            }`}
          >
            <Star
              size={20}
              className={star <= currentScore ? "fill-current" : ""}
            />
          </button>
        ))}
      </div>
    );
  };

  if (!order) return null;

  // Filtrar productos que no han sido reseñados
  const unreviewedItems = order.items.filter(item => !submittedReviews.has(item.id));

  return (
    <Modal title="Calificar Productos" onClose={onClose}>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Pedido #{order.id.slice(-8)}
          </h3>
          <p className="text-sm text-gray-600">
            Califica los productos de tu pedido
          </p>
          {submittedReviews.size > 0 && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">
                ✓ {submittedReviews.size} producto{submittedReviews.size !== 1 ? 's' : ''} ya reseñado{submittedReviews.size !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        {unreviewedItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-green-600 fill-current" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ¡Todas las reseñas enviadas!
            </h3>
            <p className="text-gray-600 mb-4">
              Has calificado todos los productos de este pedido.
            </p>
            <Button type="primary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {unreviewedItems.map((item) => {
              const reviewData = reviewsData.find(
                (r) => r.orderItemId === item.id
              );

              if (!reviewData) return null;

              return (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
                >
                  <div className="flex items-start gap-6">
                    {/* Imagen del producto */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src={`https://images.unsplash.com/photo-1601784558556-aa238f63c2be?w=150&h=150&fit=crop&crop=center`}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://via.placeholder.com/150x150/f3f4f6/6b7280?text=IMG";
                        }}
                      />
                    </div>

                    {/* Información del producto y formulario de reseña */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Cantidad: {item.quantity} • $
                          {Number(item.price).toFixed(2)}
                        </p>
                      </div>

                      {/* Calificación con estrellas */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Calificación *
                        </label>
                        {renderStars(item.id, reviewData.score)}
                      </div>

                      {/* Título de la reseña */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Título de la reseña
                        </label>
                        <input
                          type="text"
                          value={reviewData.title}
                          onChange={(e) =>
                            handleTitleChange(item.id, e.target.value)
                          }
                          placeholder="Ej: Excelente producto, muy recomendado"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Descripción de la reseña */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descripción
                        </label>
                        <textarea
                          value={reviewData.description}
                          onChange={(e) =>
                            handleDescriptionChange(item.id, e.target.value)
                          }
                          placeholder="Comparte tu experiencia con este producto..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>

                      {/* Botón de envío individual */}
                      <div className="flex justify-end pt-2">
                        <Button
                          type="primary"
                          onClick={() => handleSubmitIndividual(item.id)}
                          disabled={isSubmitting || reviewData.score === 0}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Star size={16} className="mr-2" />
                              Enviar Reseña
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Botones de acción - Solo si hay productos sin reseñar */}
        {unreviewedItems.length > 0 && (
          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200">
            <Button type="secondary" onClick={onClose} disabled={isSubmitting}>
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}