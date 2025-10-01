import { UserRol, UserStatus } from "../../../interfaces/Users";
import { useState, useEffect } from "react";
import { PaymentOption } from "../../../interfaces/PaymentOption";
import { useAuth } from "../../../hooks/Auth/useAuth";
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
  CreditCard,
  Link as LinkIcon,
  Banknote,
} from "lucide-react";

import DashboardLayout from "../../../components/Dashboard/SellerDashboard";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Inputs/Input";

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
  const {
    user,
    getPaymentOptions,
    createPaymentOption,
    updatePaymentOption,
    deletePaymentOption,
  } = useAuth();
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [linkForm, setLinkForm] = useState({ link: "", pasarela: "" });
  const [transferForm, setTransferForm] = useState({
    cvu: "",
    cbu: "",
    otrosDatos: "",
  });

  useEffect(() => {
    if (user?.id) {
      loadPaymentOptions();
    }
  }, [user]);

  const loadPaymentOptions = async () => {
    if (!user?.id) return;
    try {
      console.log("Loading payment options for user:", user.id);
      const options = await getPaymentOptions(user.id);
      console.log("Payment options loaded:", options);
      setPaymentOptions(options);
    } catch (error) {
      console.error("Error loading payment options:", error);
    }
  };

  const handleCreateLink = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      console.log("Creating link payment option for user:", user.id);
      await createPaymentOption({
        userId: user.id,
        type: "link",
        link: linkForm.link,
        pasarela: linkForm.pasarela,
      });
      console.log("Link payment option created successfully");
      setLinkForm({ link: "", pasarela: "" });
      loadPaymentOptions();
    } catch (error) {
      console.error("Error creating link payment option:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransfer = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await createPaymentOption({
        userId: user.id,
        type: "transferencia",
        cvu: transferForm.cvu,
        cbu: transferForm.cbu,
        otrosDatos: transferForm.otrosDatos,
      });
      setTransferForm({ cvu: "", cbu: "", otrosDatos: "" });
      loadPaymentOptions();
    } catch (error) {
      console.error("Error creating transfer payment option:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOption = async (id: string) => {
    try {
      await deletePaymentOption(id);
      loadPaymentOptions();
    } catch (error) {
      console.error("Error deleting payment option:", error);
    }
  };

  const analytics: AnalyticsData = {
    totalProducts: 42,
    totalSales: 154,
    totalRevenue: 12500,
    conversionRate: 3.2,
    averageRating: 4.8,
    monthlyVisitors: 2450,
  };

  if (!user) {
    return (
      <DashboardLayout title="Perfil comercial">
        <div>Cargando...</div>
      </DashboardLayout>
    );
  }

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
                    src={user.photo || "/api/placeholder/100/100"}
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
                  Vendedor desde: {new Date().toLocaleDateString()}
                </p>

                <div className="flex items-center gap-1 mt-2">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-gray-500">(154 ventas)</span>
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

          {/* Opciones de Pago */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={20} />
                Opciones de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Opciones existentes */}
              {paymentOptions.map((option) => (
                <div key={option.id} className="border rounded p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {option.type === "link" ? (
                        <LinkIcon size={16} />
                      ) : (
                        <Banknote size={16} />
                      )}
                      <span className="font-medium capitalize">
                        {option.type}
                      </span>
                    </div>
                    <Button
                      type="secondary"
                      variant="outline"
                      onClick={() => handleDeleteOption(option.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                  {option.type === "link" && (
                    <div className="mt-2 text-sm">
                      <p>Link: {option.link}</p>
                      <p>Pasarela: {option.pasarela}</p>
                    </div>
                  )}
                  {option.type === "transferencia" && (
                    <div className="mt-2 text-sm">
                      <p>CVU: {option.cvu}</p>
                      <p>CBU: {option.cbu}</p>
                      {option.otrosDatos && <p>Otros: {option.otrosDatos}</p>}
                    </div>
                  )}
                </div>
              ))}

              {/* Formulario Link */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Agregar Pago por Link</h4>
                <div className="space-y-2">
                  <Input
                    name="link"
                    label="Link de pago"
                    value={linkForm.link}
                    onChange={(e) =>
                      setLinkForm((prev) => ({ ...prev, link: e.target.value }))
                    }
                  />
                  <Input
                    name="pasarela"
                    label="Pasarela de pago"
                    value={linkForm.pasarela}
                    onChange={(e) =>
                      setLinkForm((prev) => ({
                        ...prev,
                        pasarela: e.target.value,
                      }))
                    }
                  />
                  <Button
                    type="primary"
                    onClick={handleCreateLink}
                    disabled={loading || !linkForm.link}
                    className="w-full"
                  >
                    Agregar Link
                  </Button>
                </div>
              </div>

              {/* Formulario Transferencia */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">
                  Agregar Transferencia/Efectivo
                </h4>
                <div className="space-y-2">
                  <Input
                    name="cvu"
                    label="CVU"
                    value={transferForm.cvu}
                    onChange={(e) =>
                      setTransferForm((prev) => ({
                        ...prev,
                        cvu: e.target.value,
                      }))
                    }
                  />
                  <Input
                    name="cbu"
                    label="CBU"
                    value={transferForm.cbu}
                    onChange={(e) =>
                      setTransferForm((prev) => ({
                        ...prev,
                        cbu: e.target.value,
                      }))
                    }
                  />
                  <Input
                    name="otrosDatos"
                    label="Otros datos"
                    value={transferForm.otrosDatos}
                    onChange={(e) =>
                      setTransferForm((prev) => ({
                        ...prev,
                        otrosDatos: e.target.value,
                      }))
                    }
                  />
                  <Button
                    type="primary"
                    onClick={handleCreateTransfer}
                    disabled={
                      loading || (!transferForm.cvu && !transferForm.cbu)
                    }
                    className="w-full"
                  >
                    Agregar Transferencia
                  </Button>
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
