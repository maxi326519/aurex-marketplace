import { OrderManagement } from "../../../interfaces/OrderManagement";
import { mockOrders } from "../../../data/mock/orders";
import { useState } from "react";
import usePagination from "../../../hooks/Dashboard/usePagination";

import Pagination from "../../../components/Dashboard/Table/Pagination/Pagination";
import DashboardLayout from "../../../components/Dashboard/ClientDashboard";
import OrderRow from "../../../components/Dashboard/Orders/OrderRow";

export default function ClientsOrdersPage() {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Usar el hook de paginación con los datos de prueba
  const { rows: paginatedOrders, page, setPage } = usePagination<
    OrderManagement
  >(mockOrders);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleChat = (orderId: string) => {
    console.log("Iniciar chat para el pedido:", orderId);
    // Aquí se implementaría la lógica para abrir el chat
    alert(`Iniciando chat para el pedido ${orderId}`);
  };

  const handleReport = (orderId: string) => {
    console.log("Reportar pedido:", orderId);
    // Aquí se implementaría la lógica para reportar el pedido
    alert(`Reportando pedido ${orderId}`);
  };

  return (
    <DashboardLayout title="Mis compras">
      {paginatedOrders.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes pedidos aún
          </h3>
          <p className="text-gray-500">
            Tus pedidos aparecerán aquí cuando realices una compra
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                isExpanded={expandedOrderId === order.id}
                onToggle={() => toggleOrderExpansion(order.id)}
                onChat={handleChat}
                onReport={handleReport}
              />
            ))}
          </div>

          {page.length > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination page={page} setPage={setPage} />
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
