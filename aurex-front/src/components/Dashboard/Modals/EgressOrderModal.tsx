import { useState } from "react";
import {
  OrderManagement,
  EgressOrderRequest,
  ScanProductRequest,
} from "../../../interfaces/OrderManagement";
import Button from "../../ui/Button";
import Input from "../../ui/Inputs/Input";

interface EgressOrderModalProps {
  order: OrderManagement;
  onClose: () => void;
  onEgress: (request: EgressOrderRequest) => void;
  onScan: (request: ScanProductRequest) => Promise<boolean>;
  onReimprint: (orderId: string) => void;
  loading?: boolean;
}

export default function EgressOrderModal({
  order,
  onClose,
  onEgress,
  onScan,
  onReimprint,
  loading,
}: EgressOrderModalProps) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courier, setCourier] = useState("");
  const [notes, setNotes] = useState("");
  const [scannedEANs, setScannedEANs] = useState<Record<string, string>>({});
  const [currentScanningItem, setCurrentScanningItem] = useState<string | null>(
    null
  );

  const handleScanEAN = async (itemId: string, ean: string) => {
    if (!ean.trim()) return;

    const request: ScanProductRequest = {
      orderId: order.id,
      itemId,
      ean: ean.trim(),
    };

    const isValid = await onScan(request);
    if (isValid) {
      setScannedEANs((prev) => ({
        ...prev,
        [itemId]: ean.trim(),
      }));
      setCurrentScanningItem(null);
    }
  };

  const handleEgress = () => {
    if (!trackingNumber.trim() || !courier.trim()) {
      alert("Tracking number y courier son requeridos");
      return;
    }

    const request: EgressOrderRequest = {
      orderId: order.id,
      trackingNumber: trackingNumber.trim(),
      courier: courier.trim(),
      notes: notes.trim() || undefined,
    };

    onEgress(request);
  };

  const allItemsScanned = order.items.every(
    (item) => scannedEANs[item.id] && scannedEANs[item.id] === item.product.ean
  );

  const canEgress = allItemsScanned && trackingNumber.trim() && courier.trim();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Egreso de Pedido #{order.id.slice(-8)}
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
          <div className="grid grid-cols-3 gap-4">
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
          </div>
        </div>

        {/* Validación de productos */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Validación de Productos
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
                    <p>Cantidad: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  {scannedEANs[item.id] ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <svg
                        className="w-5 h-5"
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
                      <span className="font-semibold">Validado</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-orange-500">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <span className="font-semibold">Pendiente</span>
                    </div>
                  )}
                </div>
              </div>

              {currentScanningItem === item.id ? (
                <div className="flex items-center gap-4">
                  <Input
                    name={`ean-${item.id}`}
                    type="text"
                    value=""
                    onChange={(e) => {
                      if (e.target.value.length >= 13) {
                        handleScanEAN(item.id, e.target.value);
                      }
                    }}
                  />
                  <Button
                    type="secondary"
                    onClick={() => setCurrentScanningItem(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Button
                    type="primary"
                    onClick={() => setCurrentScanningItem(item.id)}
                    disabled={!!scannedEANs[item.id]}
                  >
                    {scannedEANs[item.id] ? "EAN Validado" : "Escanear EAN"}
                  </Button>
                  {scannedEANs[item.id] && (
                    <span className="text-sm text-gray-600">
                      EAN escaneado: {scannedEANs[item.id]}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Información de envío */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Información de Envío
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="trackingNumber"
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              label="Número de Tracking *"
            />
            <Input
              name="courier"
              type="text"
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              label="Courier *"
            />
          </div>
          <Input
            name="notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            label="Notas (opcional)"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-2">
            <Button type="secondary" onClick={() => onReimprint(order.id)}>
              Reimprimir Etiqueta
            </Button>
          </div>
          <div className="flex gap-4">
            <Button type="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="primary"
              onClick={handleEgress}
              disabled={!canEgress || loading}
            >
              {loading ? "Procesando..." : "Confirmar Egreso"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
