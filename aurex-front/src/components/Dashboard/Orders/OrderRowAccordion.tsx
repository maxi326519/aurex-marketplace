import { OrderManagement } from "../../../interfaces/OrderManagement";

// Función para obtener imagen de stock basada en el tipo de producto
const getProductImage = (productName: string) => {
  const baseUrl = "https://images.unsplash.com/photo-";
  const images = {
    Smartphone: "1601784558556-aa238f63c2be?w=150&h=150&fit=crop&crop=center",
    Auriculares: "1505740420928-3838a4b0f9fd?w=150&h=150&fit=crop&crop=center",
    Mouse: "1527864550417-8fd0387a3f87?w=150&h=150&fit=crop&crop=center",
    Tablet: "1544244015-0a4a74dd90ab?w=150&h=150&fit=crop&crop=center",
    Laptop: "1496181137766-63e3e538e724?w=150&h=150&fit=crop&crop=center",
    Funda: "1558618666-fcd25c85cd64?w=150&h=150&fit=crop&crop=center",
    Cargador: "1558618047-3c8c5b5b5b5b?w=150&h=150&fit=crop&crop=center",
    Alfombrilla: "1558618047-3c8c5b5b5b5b?w=150&h=150&fit=crop&crop=center",
    "Apple Pencil": "1558618047-3c8c5b5b5b5b?w=150&h=150&fit=crop&crop=center",
  };

  const imageKey = Object.keys(images).find((key) =>
    productName.toLowerCase().includes(key.toLowerCase())
  );

  return imageKey
    ? `${baseUrl}${images[imageKey as keyof typeof images]}`
    : `${baseUrl}1601784558556-aa238f63c2be?w=150&h=150&fit=crop&crop=center`;
};

interface OrderRowAccordionProps {
  order: OrderManagement;
  isExpanded: boolean;
}

export default function OrderRowAccordion({ order, isExpanded }: OrderRowAccordionProps) {
  if (!isExpanded) return null;

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4 overflow-hidden">
      <h4 className="font-medium text-gray-900 mb-3">
        Productos del pedido
      </h4>
      <div className="space-y-3">
        {order.items.map((item, index) => {
          const itemImage = getProductImage(item.product.name);
          return (
            <div
              key={index}
              className="flex items-center gap-4 p-3 bg-white rounded-lg"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={itemImage}
                  alt={item.product.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/150x150/f3f4f6/6b7280?text=IMG";
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {item.product?.name || "Producto"}
                </p>
                <p className="text-sm text-gray-500">
                  Cantidad: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${Number(item.price).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Total: ${(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
