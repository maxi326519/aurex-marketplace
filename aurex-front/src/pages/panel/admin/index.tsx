import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import DashboardLayout from "../../../components/Dashboard/AdminDashboard";
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Calendar,
  Truck,
  Warehouse,
  UserCheck,
  PieChart,
  Eye,
} from "lucide-react";
import Button from "../../../components/ui/Button";

export default function DashboardPage() {
  // Datos de ejemplo - reemplazar con datos reales
  const metrics = {
    orders: {
      pendingToday: 26,
      pendingTotal: 142,
      completedToday: 45,
      completedMonth: 1245,
      averageValue: 156.8,
      growthRate: 12.5,
    },
    receptions: {
      pendingToday: 18,
      inProcess: 32,
      completedToday: 28,
      completedMonth: 876,
      averageTime: "2.4h",
    },
    products: {
      total: 2456,
      lowStock: 42,
      outOfStock: 12,
      newToday: 15,
    },
    users: {
      total: 1245,
      newToday: 8,
      activeNow: 43,
      sellers: 56,
      admins: 8,
    },
    revenue: {
      today: 12560,
      month: 245800,
      averageOrder: 156.8,
      growth: 15.3,
    },
  };

  return (
    <DashboardLayout title="Dashboard de Administración">
      <div className="flex flex-col gap-6">
        {/* Header con acciones */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button type="primary" className="gap-2">
            <Calendar size={16} />
            Filtros
          </Button>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Hoy
              </CardTitle>
              <DollarSign size={16} className="text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics.revenue.today.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp size={12} />+{metrics.revenue.growth}% desde ayer
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pedidos Pendientes
              </CardTitle>
              <ShoppingCart size={16} className="text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.orders.pendingTotal}
              </div>
              <p className="text-xs text-gray-500">
                {metrics.orders.pendingToday} hoy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuarios Activos
              </CardTitle>
              <Users size={16} className="text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.users.activeNow}
              </div>
              <p className="text-xs text-gray-500">Ahora mismo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Productos con Stock Bajo
              </CardTitle>
              <Package size={16} className="text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.products.lowStock}
              </div>
              <p className="text-xs text-red-600">
                {metrics.products.outOfStock} sin stock
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sección de Pedidos y Recepciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pedidos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart size={20} />
                Métricas de Pedidos
              </CardTitle>
              <BarChart3 size={16} className="text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">
                      Pendientes Hoy
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.orders.pendingToday}
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-red-600" />
                    <span className="text-sm font-medium text-red-700">
                      Pendientes Totales
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.orders.pendingTotal}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Completados Hoy
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.orders.completedToday}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      Valor Promedio
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    ${metrics.orders.averageValue}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recepciones */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Warehouse size={20} />
                Métricas de Recepciones
              </CardTitle>
              <Truck size={16} className="text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">
                      Pendientes Hoy
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.receptions.pendingToday}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      En Proceso
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.receptions.inProcess}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Completadas Hoy
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.receptions.completedToday}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">
                      Tiempo Promedio
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.receptions.averageTime}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sección de Productos y Usuarios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Productos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package size={20} />
                Estado de Inventario
              </CardTitle>
              <Eye size={16} className="text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Total Productos
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.products.total}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-green-700 mb-1">
                    Nuevos Hoy
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.products.newToday}
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-amber-700 mb-1">
                    Stock Bajo
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.products.lowStock}
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-red-700 mb-1">
                    Sin Stock
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.products.outOfStock}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usuarios */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                Estadísticas de Usuarios
              </CardTitle>
              <UserCheck size={16} className="text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Total Usuarios
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.users.total}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-700 mb-1">
                    Nuevos Hoy
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.users.newToday}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-purple-700 mb-1">
                    Vendedores
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.users.sellers}
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-amber-700 mb-1">
                    Administradores
                  </div>
                  <div className="text-2xl font-bold">
                    {metrics.users.admins}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos y Métricas Adicionales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} />
                Tendencia de Ventas (Últimos 7 días)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                Gráfico de tendencia de ventas
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart size={20} />
                Distribución de Pedidos por Estado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                Gráfico circular de estados
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
