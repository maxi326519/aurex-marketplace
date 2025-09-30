import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useCartStore from "../hooks/Store/useCarrito";

import Header from "../components/Marketplace/Header";
import Footer from "../components/Marketplace/Footer";
import Button from "../components/ui/Button";
import Input from "../components/ui/Inputs/Input";

export default function Cart() {
  const navigate = useNavigate();
  const [cupon, setCupon] = useState<string>("");

  const {
    items,
    loading,
    removeItem,
    updateQuantity,
    clear,
    getTotalItems,
    getTotalAmount,
    createOrder,
  } = useCartStore();

  function handleApplyDiscount() {
    /* TODO: Funcion de cupones */
  }

  async function handleSubmit() {
    await createOrder();
  }

  function handleClearCart() {
    clear();
  }

  return (
    <div>
      <Header />
      <div className="bg-primary-900 bg-opacity-10">
        <div className="flex justify-center p-6 text-white bg-primary">
          <h1 className="text-2xl font-bold">Carrito de Compras</h1>
        </div>

        {items.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <svg
                className="w-24 h-24 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500 mb-4">
                Agrega algunos productos para comenzar tu compra
              </p>
              <Button type="primary" onClick={() => navigate("/busqueda")}>
                Ir a Comprar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 p-6">
            <div className="flex-grow">
              <div className="flex justify-between px-6 py-4 rounded-lg text-primary font-bold bg-secondary-300">
                <span>Producto</span>
                <span>Precio</span>
                <span>Cantidad</span>
                <span>Sub Total</span>
                <span>Acciones</span>
              </div>
              <div className="flex flex-col gap-2 py-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded border border-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">
                          {item.image}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                        {item.productInfo?.sku && (
                          <p className="text-xs text-gray-500">
                            SKU: {item.productInfo.sku}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-lg font-semibold">
                      ${Number(item.price).toFixed(2)}
                    </div>
                    <div className="flex divide-x divide-gray-400 h-10 rounded-lg border border-gray-400 bg-white overflow-hidden">
                      <button
                        className="px-3 h-10 hover:bg-gray-100"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="px-3 h-10 flex items-center justify-center min-w-[3rem]">
                        {item.quantity}
                      </span>
                      <button
                        className="px-3 h-10 hover:bg-gray-100"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Eliminar producto"
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4">
                <Input
                  name="cupon"
                  value={cupon}
                  onChange={(e) => setCupon(e.target.value)}
                  label="Código de descuento"
                />
                <Button type="primary" onClick={handleApplyDiscount}>
                  Aplicar cupón
                </Button>
                <Button type="secondary" onClick={handleClearCart}>
                  Limpiar carrito
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-[300px]">
              <div className="p-4 text-center bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold">Resumen de Orden</h3>
              </div>
              <div className="flex flex-col p-4 text-start text-gray-600 bg-white rounded-lg shadow-sm space-y-2">
                <div className="flex justify-between">
                  <span>Productos ({getTotalItems()})</span>
                  <span className="font-bold">
                    ${getTotalAmount().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="font-bold">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Descuento</span>
                  <span className="font-bold">$0.00</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
              <Button
                type="primary"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Procesando..." : "Realizar Compra"}
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
