import { useState, useEffect } from "react";
import { OrderManagement } from "../../../../interfaces/OrderManagement";
import { OrdersStatus } from "../../../../interfaces/Orders";
import useOrderManagement from "../../../../hooks/Dashboard/orders/useOrderManagement";

import DashboardLayout from "../../../../components/Dashboard/AdminDashboard";
import Table from "../../../../components/Dashboard/Table/Table";
import Button from "../../../../components/ui/Button";
import PickOrderModal from "../../../../components/Dashboard/Modals/PickOrderModal";
import EgressOrderModal from "../../../../components/Dashboard/Modals/EgressOrderModal";

const statusColors = {
  [OrdersStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [OrdersStatus.PREPARED]: "bg-blue-100 text-blue-800",
  [OrdersStatus.COMPLETED]: "bg-green-100 text-green-800",
  [OrdersStatus.CANCELED]: "bg-red-100 text-red-800",
};

const statusLabels = {
  [OrdersStatus.PENDING]: "Pendiente",
  [OrdersStatus.PREPARED]: "Preparado",
  [OrdersStatus.COMPLETED]: "Completado",
  [OrdersStatus.CANCELED]: "Cancelado",
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrdersStatus>(
    OrdersStatus.PENDING
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderManagement | null>(
    null
  );
  const [showPickModal, setShowPickModal] = useState(false);
  const [showEgressModal, setShowEgressModal] = useState(false);

  const {
    orders,
    loading,
    getOrdersByStatus,
    pickOrder,
    scanProduct,
    egressOrder,
    cancelOrder,
    reimprintLabel,
  } = useOrderManagement();

  useEffect(() => {
    getOrdersByStatus(activeTab);
  }, [activeTab]);

  const handlePickOrder = (order: OrderManagement) => {
    setSelectedOrder(order);
    setShowPickModal(true);
  };

  const handleEgressOrder = (order: OrderManagement) => {
    setSelectedOrder(order);
    setShowEgressModal(true);
  };

  const handleCancelOrder = async (order: OrderManagement) => {
    if (
      window.confirm(
        `¿Estás seguro de cancelar el pedido #${order.id.slice(-8)}?`
      )
    ) {
      await cancelOrder(order.id);
    }
  };

  const handlePick = async (request: any) => {
    await pickOrder(request);
    setShowPickModal(false);
    setSelectedOrder(null);
  };

  const handleEgress = async (request: any) => {
    await egressOrder(request);
    setShowEgressModal(false);
    setSelectedOrder(null);
  };

  const handleReimprint = async (orderId: string) => {
    await reimprintLabel(orderId);
  };

  const getOrderActions = (order: OrderManagement) => {
    switch (order.status) {
      case OrdersStatus.PENDING:
        return (
          <div className="flex gap-2">
            <Button
              type="primary"
              onClick={() => handlePickOrder(order)}
              className="text-xs px-3 py-1"
            >
              Pickear
            </Button>
            <Button
              type="secondary"
              onClick={() => handleCancelOrder(order)}
              className="text-xs px-3 py-1"
            >
              Cancelar
            </Button>
          </div>
        );
      case OrdersStatus.PREPARED:
        return (
          <div className="flex gap-2">
            <Button
              type="primary"
              onClick={() => handleEgressOrder(order)}
              className="text-xs px-3 py-1"
            >
              Egreso
            </Button>
            <Button
              type="secondary"
              onClick={() => handleReimprint(order.id)}
              className="text-xs px-3 py-1"
            >
              Reimprimir
            </Button>
          </div>
        );
      case OrdersStatus.COMPLETED:
        return (
          <div className="flex gap-2">
            <Button
              type="secondary"
              onClick={() => handleReimprint(order.id)}
              className="text-xs px-3 py-1"
            >
              Reimprimir
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const tableColumns = [
    { header: "ID Pedido", key: "id" },
    { header: "Cliente", key: "clientName" },
    { header: "Fecha", key: "date" },
    { header: "Productos", key: "items" },
    { header: "Total", key: "totalAmount" },
    { header: "Estado", key: "status" },
    { header: "Acciones", key: "actions" },
  ];

  const formatOrderData = (orders: OrderManagement[]) => {
    console.log(orders);
    return orders.map((order) => ({
      ...order,
      id: `#${order.id.slice(-8)}`,
      clientName: order.clientName || "N/A",
      date: new Date(order.date).toLocaleDateString(),
      items: `${order.items.length} producto${
        order.items.length !== 1 ? "s" : ""
      }`,
      totalAmount: `$${Number(order.totalAmount).toFixed(2)}`,
      status: (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            statusColors[order.status]
          }`}
        >
          {statusLabels[order.status]}
        </span>
      ),
      actions: getOrderActions(order),
    }));
  };

  return (
    <DashboardLayout title="Gestión de Pedidos">
      <div className="flex flex-col gap-6">
        {/* Tabs de estado */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {(Object.values(OrdersStatus) as OrdersStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === status
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {statusLabels[status]} ({orders.length})
            </button>
          ))}
        </div>

        {/* Tabla de pedidos */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando pedidos...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
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
                No hay pedidos {statusLabels[activeTab].toLowerCase()}
              </h3>
              <p className="text-gray-500">
                Los pedidos aparecerán aquí cuando estén disponibles
              </p>
            </div>
          ) : (
            <Table columns={tableColumns} data={formatOrderData(orders)} />
          )}
        </div>

        {/* Modales */}
        {showPickModal && selectedOrder && (
          <PickOrderModal
            order={selectedOrder}
            onClose={() => {
              setShowPickModal(false);
              setSelectedOrder(null);
            }}
            onPick={handlePick}
            loading={loading}
          />
        )}

        {showEgressModal && selectedOrder && (
          <EgressOrderModal
            order={selectedOrder}
            onClose={() => {
              setShowEgressModal(false);
              setSelectedOrder(null);
            }}
            onEgress={handleEgress}
            onScan={scanProduct}
            onReimprint={handleReimprint}
            loading={loading}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
