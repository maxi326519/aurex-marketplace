import { Post } from "../../interfaces/Posts";
import useCartStore from "../../hooks/Store/useCarrito";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  post: Post;
  title: string;
  price: number;
  image: string;
  discount?: number;
  description?: string;
  productInfo?: {
    sku?: string;
    category?: string;
    stock?: number;
    status?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({
  post,
  title,
  price,
  image,
  discount,
  description,
  productInfo,
}) => {
  const { addItem } = useCartStore();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addItem(post);
  };

  const handleViewDetails = () => {
    navigate(`/producto/${post.id}`);
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500 text-sm">{image}</span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>

        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {productInfo && (
          <div className="text-xs text-gray-500 mb-3 space-y-1">
            {productInfo.sku && <p>SKU: {productInfo.sku}</p>}
            {productInfo.category && <p>Categoría: {productInfo.category}</p>}
            {productInfo.stock !== undefined && (
              <p
                className={
                  productInfo.stock > 0 ? "text-green-600" : "text-red-600"
                }
              >
                Stock: {productInfo.stock}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">
              ${Number(price).toFixed(2)}
            </span>
            {discount && discount > 0 && (
              <span className="ml-2 text-sm line-through text-gray-500">
                ${Number(price / (1 - discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
          {discount && discount > 0 && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-bold">
              {discount}% OFF
            </span>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={handleViewDetails}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            Ver Detalles
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
