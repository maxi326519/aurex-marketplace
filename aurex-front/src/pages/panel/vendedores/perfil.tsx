import { UserRol, UserStatus } from "../../../interfaces/Users";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  User,
  Edit,
  Package,
  TrendingUp,
  DollarSign,
  Star,
  ShoppingCart,
  BarChart3,
  Target,
} from "lucide-react";

import DashboardLayout from "../../../components/Dashboard/SellerDashboard";
import Button from "../../../components/ui/Button";

export interface User {
  id?: string;
  name: string;
  email: string;
  photo: string;
  rol: UserRol;
  status: UserStatus;
  storeName?: string;
  rating?: number;
  totalSales?: number;
  joinDate?: string;
}

interface AnalyticsData {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
  averageRating: number;
  monthlyVisitors: number;
}

export default function SellerProfilePage() {
  // Datos de ejemplo - reemplazar con datos reales
  const user: User = {
    id: "1",
    name: "Juan Pérez",
    email: "juan.perez@tienda.com",
    photo: "/api/placeholder/100/100",
    rol: UserRol.SELLER,
    status: UserStatus.ACTIVE,
    storeName: "Tienda Juan",
    rating: 4.8,
    totalSales: 154,
    joinDate: "15/03/2023",
  };

  const analytics: AnalyticsData = {
    totalProducts: 42,
    totalSales: 154,
    totalRevenue: 12500,
    conversionRate: 3.2,
    averageRating: 4.8,
    monthlyVisitors: 2450,
  };

  return (
    <DashboardLayout title="Perfil comercial">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Perfil Comercial - Izquierda */}
        <div className="w-full lg:w-1/3">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">
                Perfil Comercial
              </CardTitle>
              <Button type="primary">
                <Edit size={16} />
                Editar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                    <User size={16} className="text-white" />
                  </div>
                </div>

                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Vendedor desde: {user.joinDate}
                </p>

                {user.storeName && (
                  <div className="mt-3 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {user.storeName}
                  </div>
                )}

                <div className="flex items-center gap-1 mt-2">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{user.rating}</span>
                  <span className="text-gray-500">
                    ({user.totalSales} ventas)
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    {user.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rol:</span>
                  <span className="font-medium capitalize">{user.rol}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analíticas - Derecha */}
        <div className="w-full lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Productos Totales */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Productos Totales
                </CardTitle>
                <Package size={16} className="text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics.totalProducts}
                </div>
                <p className="text-xs text-gray-500">+5% desde el mes pasado</p>
              </CardContent>
            </Card>

            {/* Ventas Totales */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ventas Totales
                </CardTitle>
                <ShoppingCart size={16} className="text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalSales}</div>
                <p className="text-xs text-gray-500">
                  +12% desde el mes pasado
                </p>
              </CardContent>
            </Card>

            {/* Ingresos Totales */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ingresos Totales
                </CardTitle>
                <DollarSign size={16} className="text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${analytics.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">+8% desde el mes pasado</p>
              </CardContent>
            </Card>

            {/* Tasa de Conversión */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tasa de Conversión
                </CardTitle>
                <TrendingUp size={16} className="text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics.conversionRate}%
                </div>
                <p className="text-xs text-gray-500">
                  Promedio del sector: 2.5%
                </p>
              </CardContent>
            </Card>

            {/* Visitantes Mensuales */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Visitantes Mensuales
                </CardTitle>
                <BarChart3 size={16} className="text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics.monthlyVisitors.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">
                  +15% desde el mes pasado
                </p>
              </CardContent>
            </Card>

            {/* Rating Promedio */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Rating Promedio
                </CardTitle>
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics.averageRating}/5
                </div>
                <p className="text-xs text-gray-500">Basado en 128 opiniones</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico adicional o más métricas */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} />
                Rendimiento Mensual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                Gráfico de rendimiento mensual (implementar con librería de
                gráficos)
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                <div>
                  <div className="text-sm text-gray-600">Ventas este mes</div>
                  <div className="font-bold text-lg">42</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Ingresos este mes</div>
                  <div className="font-bold text-lg">$3,250</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Objetivo cumplido</div>
                  <div className="font-bold text-lg">78%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
