import { useState } from "react";
import {
  OrderManagement,
  PickOrderRequest,
} from "../../../interfaces/OrderManagement";
import Button from "../../ui/Button";
import Input from "../../ui/Inputs/Input";

interface PickOrderModalProps {
  order: OrderManagement;
  onClose: () => void;
  onPick: (request: PickOrderRequest) => void;
  loading?: boolean;
}

export default function PickOrderModal({
  order,
  onClose,
  onPick,
  loading,
}: PickOrderModalProps) {
  const [pickedQuantities, setPickedQuantities] = useState<
    Record<string, number>
  >(
    order.items.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {} as Record<string, number>)
  );

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setPickedQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(
        0,
        Math.min(
          quantity,
          order.items.find((i) => i.id === itemId)?.quantity || 0
        )
      ),
    }));
  };

  const handlePick = () => {
    const request: PickOrderRequest = {
      orderId: order.id,
      items: order.items.map((item) => ({
        itemId: item.id,
        quantity: pickedQuantities[item.id] || 0,
      })),
    };
    onPick(request);
  };

  const canPick = order.items.every(
    (item) =>
      pickedQuantities[item.id] > 0 &&
      pickedQuantities[item.id] <= item.quantity
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Pickear Pedido #{order.id.slice(-8)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Información del pedido */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Cliente</p>
              <p className="font-semibold">{order.clientName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha de Venta</p>
              <p className="font-semibold">
                {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-semibold">
                ${Number(order.totalAmount).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <p className="font-semibold">{order.status}</p>
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Productos a Pickear
          </h3>
          {order.items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {item.product.name}
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>SKU: {item.product.sku}</p>
                    <p>EAN: {item.product.ean}</p>
                    {item.product.position && (
                      <p>Posición: {item.product.position}</p>
                    )}
                    <p>
                      Categoría: {item.product.category1} -{" "}
                      {item.product.category2}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Cantidad Pedida</p>
                  <p className="font-semibold text-lg">{item.quantity}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Cantidad a Pickear:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.id,
                        pickedQuantities[item.id] - 1
                      )
                    }
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    disabled={pickedQuantities[item.id] <= 0}
                  >
                    -
                  </button>
                  <Input
                    name={`quantity-${item.id}`}
                    type="number"
                    value={pickedQuantities[item.id]}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.id,
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(
                        item.id,
                        pickedQuantities[item.id] + 1
                      )
                    }
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    disabled={pickedQuantities[item.id] >= item.quantity}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  de {item.quantity} unidades
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
          <Button type="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="primary"
            onClick={handlePick}
            disabled={!canPick || loading}
          >
            {loading ? "Pickeando..." : "Confirmar Pickeo"}
          </Button>
        </div>
      </div>
    </div>
  );
}
