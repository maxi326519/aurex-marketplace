import { Link as LinkIcon, Banknote } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/Auth/useAuth";
import useCartStore from "../hooks/Store/useCarrito";

import Header from "../components/Marketplace/Headers/Header";
import Footer from "../components/Marketplace/Footer";
import Button from "../components/ui/Button";

interface PaymentOption {
  id: string;
  businessId: string;
  type: "link" | "transferencia";
  link?: string;
  pasarela?: string;
  cvu?: string;
  cbu?: string;
  otrosDatos?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Pagos() {
  const navigate = useNavigate();
  const {
    items,
    loading: cartLoading,
    createOrder,
    getFirstBusinessId,
  } = useCartStore();
  const { getPaymentOptions, user } = useAuth();
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPaymentOptions = async () => {
      const businessId = getFirstBusinessId();
      console.log("BusinessId from first item:", businessId);
      console.log("Items in cart:", items);
      if (businessId) {
        try {
          const opts = await getPaymentOptions(businessId);
          console.log("Payment options received:", opts);
          setPaymentOptions(opts);
        } catch (error) {
          console.error(
            `Error loading payment options for business ${businessId}:`,
            error
          );
        }
      }
    };

    if (items.length > 0) {
      loadPaymentOptions();
    }
  }, [items, getFirstBusinessId, getPaymentOptions]);

  const handlePayment = async () => {
    if (!selectedOption) return;

    setLoading(true);
    try {
      await (createOrder as any)(user?.id); // Pasar el userId del usuario autenticado
      navigate("/"); // O a una página de confirmación
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (items.length === 0) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-600 mb-4">
              No hay productos en el carrito
            </h1>
            <Button type="primary" onClick={() => navigate("/busqueda")}>
              Ir a Comprar
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="bg-primary-900 bg-opacity-10 min-h-screen">
        <div className="flex justify-center p-6 text-white bg-primary">
          <h1 className="text-2xl font-bold">Selecciona Método de Pago</h1>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {/* Resumen de orden */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Resumen de Orden</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.title} x{item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${getTotalAmount().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Opciones de pago */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              Métodos de Pago Disponibles
            </h2>

            <div className="space-y-3">
              {paymentOptions.map((option) => (
                <div
                  key={option.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedOption === option.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  <div className="flex items-center gap-3">
                    {option.type === "link" ? (
                      <LinkIcon size={20} className="text-blue-500" />
                    ) : (
                      <Banknote size={20} className="text-green-500" />
                    )}
                    <div>
                      <div className="font-medium capitalize">
                        {option.type}
                      </div>
                      {option.type === "link" && (
                        <div className="text-sm text-gray-600">
                          <p>Link: {option.link}</p>
                          <p>Pasarela: {option.pasarela}</p>
                        </div>
                      )}
                      {option.type === "transferencia" && (
                        <div className="text-sm text-gray-600">
                          <p>CVU: {option.cvu}</p>
                          <p>CBU: {option.cbu}</p>
                          {option.otrosDatos && (
                            <p>Otros: {option.otrosDatos}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {paymentOptions.length === 0 && (
              <p className="text-gray-500">Cargando métodos de pago...</p>
            )}

            <div className="mt-6 flex gap-4">
              <Button
                type="secondary"
                onClick={() => navigate("/carrito")}
                className="flex-1"
              >
                Volver al Carrito
              </Button>
              <Button
                type="primary"
                onClick={handlePayment}
                disabled={!selectedOption || loading || cartLoading}
                className="flex-1"
              >
                {loading ? "Procesando..." : "Pagar"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
