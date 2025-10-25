import { User, UserRol, UserStatus, initUser } from "../../interfaces/Users";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Business, initBusiness } from "../../interfaces/Business";
import { PaymentOption } from "../../interfaces/PaymentOption";
import { useBusiness } from "../../hooks/Dashboard/useBusiness";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/Auth/useAuth";

import Header from "../../components/Marketplace/Headers/Header";
import Footer from "../../components/Marketplace/Footer";
import Input from "../../components/ui/Inputs/Input";
import Button from "../../components/ui/Button";

export default function VendedorRegister() {
  const navigate = useNavigate();
  const { completeVendedorRegistration, loading, user, business } = useAuth();
  const { createPaymentOption } = useBusiness();

  // Estados para el flujo de pasos
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string>("");

  // Estados para cada paso
  const [personalData, setPersonalData] = useState<User>({
    ...initUser(),
    status: UserStatus.WAITING,
  });
  const [businessData, setBusinessData] = useState<Business>(initBusiness());
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);

  // Estados para formularios de pago
  const [linkForm, setLinkForm] = useState({ link: "", pasarela: "" });
  const [transferForm, setTransferForm] = useState({
    cvu: "",
    cbu: "",
    otrosDatos: "",
  });

  // Funciones para manejo de datos personales
  const handlePersonalDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Funciones para manejo de datos del negocio
  const handleBusinessDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBusinessTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Funciones para métodos de pago
  const handleCreateLink = () => {
    if (!linkForm.link) return;

    const newOption: PaymentOption = {
      id: Date.now().toString(),
      businessId: "", // Se asignará después del registro del negocio
      type: "link",
      link: linkForm.link,
      pasarela: linkForm.pasarela,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPaymentOptions((prev) => [...prev, newOption]);
    setLinkForm({ link: "", pasarela: "" });
  };

  const handleCreateTransfer = () => {
    if (!transferForm.cvu && !transferForm.cbu) return;

    const newOption: PaymentOption = {
      id: Date.now().toString(),
      businessId: "", // Se asignará después del registro del negocio
      type: "transferencia",
      cvu: transferForm.cvu,
      cbu: transferForm.cbu,
      otrosDatos: transferForm.otrosDatos,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPaymentOptions((prev) => [...prev, newOption]);
    setTransferForm({ cvu: "", cbu: "", otrosDatos: "" });
  };

  const handleDeletePaymentOption = (id: string) => {
    setPaymentOptions((prev) => prev.filter((option) => option.id !== id));
  };

  // Funciones de navegación entre pasos
  const nextStep = () => {
    if (currentStep === 1) {
      // Validar paso 1: datos personales
      if (!personalData.name || !personalData.phone) {
        setError("Por favor completa el nombre y teléfono");
        return;
      }
    } else if (currentStep === 2) {
      // Validar paso 2: datos del negocio
      if (
        !businessData.name ||
        !businessData.type ||
        !businessData.description
      ) {
        setError(
          "Por favor completa el nombre, tipo y descripción del negocio"
        );
        return;
      }
    }

    setError(""); // Limpiar errores si la validación pasa
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setError("");

      // Validar datos requeridos
      if (!personalData.name || !personalData.phone) {
        setError("Por favor completa todos los campos obligatorios");
        return;
      }

      if (
        !businessData.name ||
        !businessData.type ||
        !businessData.description
      ) {
        setError("Por favor completa todos los campos del negocio");
        return;
      }

      // Add current user data
      const userData: User = {
        ...personalData,
        id: user?.id!,
        email: user?.email!,
        rol: UserRol.SELLER,
        status: UserStatus.WAITING,
      };

      // Complete registration
      await completeVendedorRegistration(userData, businessData);

      // Crear opciones de pago si existen
      if (paymentOptions.length > 0) {
        // Esperar un momento para que el negocio se actualice en el store
        setTimeout(async () => {
          try {
            for (const option of paymentOptions) {
              if (business?.id) {
                await createPaymentOption({
                  ...option,
                  businessId: business.id,
                });
              }
            }
          } catch (error) {
            console.error("Error creando opciones de pago:", error);
          }
        }, 1000);
      }

      navigate("/panel/vendedor/analiticas");
    } catch (error) {
      console.error("Error al completar registro:", error);
      setError(
        error instanceof Error ? error.message : "Error al completar registro"
      );
    }
  };

  const handleSkip = () => {
    navigate("/panel/vendedor/analiticas");
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {currentStep > step ? <Check size={16} /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                currentStep > step ? "bg-primary" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Información Personal y Dirección
            </h2>

            {/* Información personal */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-medium mb-4 text-gray-600">
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  label="Nombre completo *"
                  value={personalData.name}
                  onChange={handlePersonalDataChange}
                  disabled={loading}
                />
                <Input
                  name="phone"
                  label="Teléfono *"
                  type="tel"
                  value={personalData.phone || ""}
                  onChange={handlePersonalDataChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Dirección */}
            <div className="pb-6">
              <h3 className="text-lg font-medium mb-4 text-gray-600">
                Dirección
              </h3>
              <div className="space-y-4">
                <Input
                  name="address"
                  label="Dirección"
                  value={personalData.address || ""}
                  onChange={handlePersonalDataChange}
                  disabled={loading}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    name="city"
                    label="Ciudad"
                    value={personalData.city || ""}
                    onChange={handlePersonalDataChange}
                    disabled={loading}
                  />
                  <Input
                    name="state"
                    label="Estado/Provincia"
                    value={personalData.state || ""}
                    onChange={handlePersonalDataChange}
                    disabled={loading}
                  />
                  <Input
                    name="zipCode"
                    label="Código postal"
                    value={personalData.zipCode || ""}
                    onChange={handlePersonalDataChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Información del Negocio
            </h2>

            <div className="space-y-4">
              <Input
                name="name"
                label="Nombre del negocio *"
                value={businessData.name}
                onChange={handleBusinessDataChange}
                disabled={loading}
              />
              <Input
                name="type"
                label="Tipo de negocio *"
                value={businessData.type}
                onChange={handleBusinessDataChange}
                disabled={loading}
              />
              <div className="relative flex flex-col overflow-hidden">
                <label
                  htmlFor="description"
                  className="absolute top-1 left-2 text-xs text-gray-500 font-medium"
                >
                  Descripción del negocio *
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="text-black p-2 pt-5 focus:outline-none rounded-lg border border-gray-200 bg-white min-h-[100px] disabled:opacity-50"
                  placeholder="Cuéntanos sobre tu negocio, qué productos vendes, etc."
                  value={businessData.description}
                  onChange={handleBusinessTextareaChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="taxId"
                  label="CUIT/CUIL"
                  value={businessData.taxId}
                  onChange={handleBusinessDataChange}
                  disabled={loading}
                />
                <Input
                  name="bankAccount"
                  label="Cuenta bancaria"
                  value={businessData.bankAccount}
                  onChange={handleBusinessDataChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Métodos de Pago
            </h2>
            <p className="text-gray-600 mb-6">
              Configura cómo quieres recibir los pagos de tus clientes
            </p>

            {/* Opciones existentes */}
            {paymentOptions.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">
                  Métodos configurados:
                </h3>
                {paymentOptions.map((option) => (
                  <div
                    key={option.id}
                    className="border rounded p-3 bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">
                          {option.type === "link"
                            ? "Pago por Link"
                            : "Transferencia"}
                        </span>
                      </div>
                      <Button
                        type="secondary"
                        variant="outline"
                        onClick={() => handleDeletePaymentOption(option.id!)}
                        disabled={loading}
                      >
                        Eliminar
                      </Button>
                    </div>
                    {option.type === "link" && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Link: {option.link}</p>
                        <p>Pasarela: {option.pasarela}</p>
                      </div>
                    )}
                    {option.type === "transferencia" && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>CVU: {option.cvu}</p>
                        <p>CBU: {option.cbu}</p>
                        {option.otrosDatos && <p>Otros: {option.otrosDatos}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Formulario Link */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3 text-gray-700">
                Agregar Pago por Link
              </h3>
              <div className="space-y-3">
                <Input
                  name="link"
                  label="Link de pago"
                  value={linkForm.link}
                  onChange={(e) =>
                    setLinkForm((prev) => ({ ...prev, link: e.target.value }))
                  }
                  disabled={loading}
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
                  disabled={loading}
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
              <h3 className="font-medium mb-3 text-gray-700">
                Agregar Transferencia/Efectivo
              </h3>
              <div className="space-y-3">
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
                <Button
                  type="primary"
                  onClick={handleCreateTransfer}
                  disabled={loading || (!transferForm.cvu && !transferForm.cbu)}
                  className="w-full"
                >
                  Agregar Transferencia
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={false} />
      <div className="grow flex flex-col justify-center items-center py-10">
        <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Completa tu perfil de vendedor
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Configura tu tienda y comienza a vender en nuestra plataforma
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {renderStepIndicator()}
          {renderStepContent()}

          <div className="flex gap-3 pt-6 mt-6 border-t">
            {currentStep > 1 && (
              <Button
                type="secondary"
                variant="outline"
                onClick={prevStep}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <ChevronLeft size={16} />
                Anterior
              </Button>
            )}

            {currentStep < 3 ? (
              <Button
                type="primary"
                onClick={nextStep}
                disabled={loading}
                className="flex items-center gap-2 ml-auto"
              >
                Siguiente
                <ChevronRight size={16} />
              </Button>
            ) : (
              <div className="flex gap-3 ml-auto">
                <Button
                  type="secondary"
                  variant="outline"
                  onClick={handleSkip}
                  disabled={loading}
                >
                  Omitir por ahora
                </Button>
                <Button type="primary" onClick={handleSubmit} loading={loading}>
                  Completar registro
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
