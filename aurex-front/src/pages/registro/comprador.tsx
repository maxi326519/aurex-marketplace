import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Header from "../../components/Marketplace/Header";
import Footer from "../../components/Marketplace/Footer";
import Input from "../../components/ui/Inputs/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/Auth/useAuth";
import { initCompradorRegistration, CompradorRegistrationData } from "../../interfaces/Users";

export default function CompradorRegister() {
  const navigate = useNavigate();
  const { completeCompradorRegistration, loading } = useAuth();
  const [formData, setFormData] = useState<CompradorRegistrationData>(initCompradorRegistration());
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await completeCompradorRegistration(formData);
      navigate("/panel/compras");
    } catch (error) {
      console.error("Error al completar registro:", error);
      setError(error instanceof Error ? error.message : "Error al completar registro");
    }
  };

  const handleSkip = () => {
    navigate("/panel/compras");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={false} />
      <div className="grow flex flex-col justify-center items-center py-10">
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Completa tu perfil de comprador
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Ayúdanos a conocerte mejor para brindarte una mejor experiencia de compra
          </p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
            
            <Input
              name="address"
              label="Dirección"
              value={formData.address}
              onChange={handleInputChange}
            />
            
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            
            <Input
              name="zipCode"
              label="Código postal"
              value={formData.zipCode}
              onChange={handleInputChange}
            />
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="primary" 
                className="flex-1"
                onClick={() => handleSubmit(new Event('submit') as any)}
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
