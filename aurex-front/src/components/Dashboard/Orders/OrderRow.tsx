import { OrderManagement } from "../../../interfaces/OrderManagement";
import { OrdersStatus } from "../../../interfaces/Orders";
import { useState } from "react";

import IconOptions from "../../Icons/IconOptions";
import OptionsMenu from "./OptionsMenu";
import OrderRowAccordion from "./OrderRowAccordion";

const statusColors = {
  [OrdersStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [OrdersStatus.PREPARED]: "bg-blue-100 text-blue-800",
  [OrdersStatus.COMPLETED]: "bg-green-100 text-green-800",
  [OrdersStatus.CANCELED]: "bg-red-100 text-red-800",
};

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

interface OrderRowProps {
  order: OrderManagement;
  isExpanded: boolean;
  onToggle: () => void;
  onChat: (orderId: string) => void;
  onReport: (orderId: string) => void;
}

export default function OrderRow({
  order,
  isExpanded,
  onToggle,
  onChat,
  onReport,
}: OrderRowProps) {
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const lastItem = order.items[order.items.length - 1];
  const productImage = getProductImage(lastItem.product.name);

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOptionsMenuOpen(prev => !prev);
  };

  const handleRowClick = () => {
    onToggle();
  };

  const handleChat = () => {
    onChat(order.id);
  };

  const handleReport = () => {
    onReport(order.id);
  };

  return (
    <div className="border border-gray-200 rounded-lg mb-4 relative">
      {/* Row principal */}
      <div
        className="p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={handleRowClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Imagen del último producto */}
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={productImage}
                alt={lastItem.product.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/150x150/f3f4f6/6b7280?text=IMG";
                }}
              />
            </div>

            {/* Información del pedido */}
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium text-gray-900">
                    #{order.id.slice(-8)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {order.items.length} producto
                    {order.items.length !== 1 ? "s" : ""}
                  </p>
                  <p className="font-semibold text-gray-900">
                    ${Number(order.totalAmount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Estado y botón de opciones */}
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                statusColors[order.status]
              }`}
            >
              {order.status}
            </span>
            <div className="relative">
              <button
                onClick={handleOptionsClick}
                title="Opciones del pedido"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <IconOptions size={16} className="text-gray-500" />
              </button>
              <OptionsMenu
                isOpen={isOptionsMenuOpen}
                onClose={() => setIsOptionsMenuOpen(false)}
                onChat={handleChat}
                onReport={handleReport}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desplegable con detalles */}
      <OrderRowAccordion order={order} isExpanded={isExpanded} />
    </div>
  );
}
