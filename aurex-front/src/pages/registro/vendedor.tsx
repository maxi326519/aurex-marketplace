import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/Auth/useAuth";
import {
  initVendedorRegistration,
  VendedorRegistrationData,
} from "../../interfaces/Users";

import Header from "../../components/Marketplace/Headers/Header";
import Footer from "../../components/Marketplace/Footer";
import Input from "../../components/ui/Inputs/Input";
import Button from "../../components/ui/Button";

export default function VendedorRegister() {
  const navigate = useNavigate();
  const { completeVendedorRegistration, loading } = useAuth();
  const [formData, setFormData] = useState<VendedorRegistrationData>(
    initVendedorRegistration()
  );
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await completeVendedorRegistration(formData);
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información personal */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información Personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  label="Nombre completo"
                  value={formData.name}
                  onChange={handleInputChange}
                />

                <Input
                  name="phone"
                  label="Teléfono"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Información del negocio */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información del Negocio
              </h2>
              <div className="space-y-4">
                <Input
                  name="businessName"
                  label="Nombre del negocio"
                  value={formData.businessName}
                  onChange={handleInputChange}
                />

                <Input
                  name="businessType"
                  label="Tipo de negocio"
                  value={formData.businessType}
                  onChange={handleInputChange}
                />

                <div className="relative flex flex-col overflow-hidden">
                  <label
                    htmlFor="businessDescription"
                    className="absolute top-1 left-2 text-xs text-gray-500 font-medium"
                  >
                    Descripción del negocio
                  </label>
                  <textarea
                    id="businessDescription"
                    name="businessDescription"
                    className="text-black p-2 pt-5 focus:outline-none rounded-lg border border-gray-200 bg-white min-h-[100px]"
                    placeholder="Cuéntanos sobre tu negocio, qué productos vendes, etc."
                    value={formData.businessDescription}
                    onChange={handleTextareaChange}
                  />
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Dirección
              </h2>
              <div className="space-y-4">
                <Input
                  name="address"
                  label="Dirección"
                  value={formData.address}
                  onChange={handleInputChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    name="city"
                    label="Ciudad"
                    value={formData.city}
                    onChange={handleInputChange}
                  />

                  <Input
                    name="state"
                    label="Estado/Provincia"
                    value={formData.state}
                    onChange={handleInputChange}
                  />

                  <Input
                    name="zipCode"
                    label="Código postal"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Información fiscal y bancaria */}
            <div className="pb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Información Fiscal y Bancaria
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="taxId"
                  label="RFC / Tax ID"
                  value={formData.taxId}
                  onChange={handleInputChange}
                />

                <Input
                  name="bankAccount"
                  label="Cuenta bancaria"
                  value={formData.bankAccount}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="primary"
                className="flex-1"
                onClick={() => handleSubmit(new Event("submit") as any)}
                disabled={loading}
              >
                {loading ? "Completando..." : "Completar registro"}
              </Button>
              <Button
                type="primary"
                variant="outline"
                className="flex-1"
                onClick={handleSkip}
                disabled={loading}
              >
                Omitir por ahora
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
