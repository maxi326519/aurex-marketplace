import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Star,
  BarChart3,
  PieChart,
  Calendar,
  Download,
} from "lucide-react";

import DashboardLayout from "../../../components/Dashboard/SellerDashboard";
import Table from "../../../components/Dashboard/Table/Table";
import Button from "../../../components/ui/Button";

const tableColumns = [
  { header: "ID", key: "id" },
  { header: "Nombre", key: "name" },
  { header: "Email", key: "email" },
  { header: "Teléfono", key: "phone" },
  { header: "Publicaciones", key: "publications" },
  { header: "Estado", key: "status" },
];

// Datos de ejemplo para las analíticas
const analyticsData = {
  general: {
    totalProducts: 156,
    totalSales: 289,
    totalRevenue: 45890,
    conversionRate: 4.2,
    monthlyVisitors: 12540,
    customerSatisfaction: 4.7,
  },
  sales: {
    today: 12,
    thisWeek: 78,
    thisMonth: 289,
    averageOrderValue: 158.75,
    bestSellingProduct: "SmartWatch Pro",
    salesGrowth: 15.3,
  },
  products: {
    published: 142,
    draft: 14,
    lowStock: 8,
    outOfStock: 3,
    topRatedProduct: "Cámara DSLR 4K",
    categories: 12,
  },
  combos: {
    total: 18,
    active: 15,
    totalSales: 67,
    revenueFromCombos: 12560,
    mostPopularCombo: "Kit Fotografía",
    comboConversion: 5.8,
  },
  customers: {
    total: 458,
    newThisMonth: 42,
    returning: 216,
    averageSpent: 143.2,
    topCustomer: "María González",
  },
};

export default function SellerAnaliticsPage() {
  const rows: [] = [];

  return (
    <DashboardLayout title="Analíticas">
      <div className="flex flex-col gap-6">
        {/* Header con acciones */}
        <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-2">
          <div>
            <p className="ps-4 text-xl text-gray-600 font-semibold">
              Resumen completo de tu rendimiento comercial
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="primary" variant="outline" className="gap-2">
              <Calendar size={16} />
              Filtros
            </Button>
            <Button type="primary" variant="outline" className="gap-2">
              <Download size={16} />
              Exportar
            </Button>
          </div>
        </Card>

        {/* Métricas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Productos Totales
              </CardTitle>
              <Package size={16} className="text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.general.totalProducts}
              </div>
              <p className="text-xs text-gray-500">+8% desde mes pasado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ventas Totales
              </CardTitle>
              <ShoppingCart size={16} className="text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.general.totalSales}
              </div>
              <p className="text-xs text-gray-500">+15.3% crecimiento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Totales
              </CardTitle>
              <DollarSign size={16} className="text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${analyticsData.general.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">+12% desde mes pasado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Satisfacción
              </CardTitle>
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.general.customerSatisfaction}/5
              </div>
              <p className="text-xs text-gray-500">128 opiniones</p>
            </CardContent>
          </Card>
        </div>

        {/* Sección de Ventas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart size={20} />
                Rendimiento de Ventas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-700">Hoy</div>
                  <div className="font-bold text-xl">
                    {analyticsData.sales.today}
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-green-700">Esta Semana</div>
                  <div className="font-bold text-xl">
                    {analyticsData.sales.thisWeek}
                  </div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="text-sm text-amber-700">Valor Promedio</div>
                  <div className="font-bold text-xl">
                    ${analyticsData.sales.averageOrderValue}
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm text-purple-700">Crecimiento</div>
                  <div className="font-bold text-xl">
                    +{analyticsData.sales.salesGrowth}%
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-sm font-medium">Producto Más Vendido</div>
                <div className="font-semibold">
                  {analyticsData.sales.bestSellingProduct}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package size={20} />
                Estado de Productos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-green-700">Publicados</div>
                  <div className="font-bold text-xl">
                    {analyticsData.products.published}
                  </div>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="text-sm text-gray-700">En Borrador</div>
                  <div className="font-bold text-xl">
                    {analyticsData.products.draft}
                  </div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="text-sm text-amber-700">Stock Bajo</div>
                  <div className="font-bold text-xl">
                    {analyticsData.products.lowStock}
                  </div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-sm text-red-700">Sin Stock</div>
                  <div className="font-bold text-xl">
                    {analyticsData.products.outOfStock}
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-sm font-medium">
                  Producto Mejor Calificado
                </div>
                <div className="font-semibold">
                  {analyticsData.products.topRatedProduct}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">4.9/5 (86 opiniones)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos y Tabla */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} />
                Tendencia de Ventas (Últimos 30 días)
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
                Distribución por Categoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                Gráfico circular de categorías
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de datos */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Publicaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Table columns={tableColumns} data={rows} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
