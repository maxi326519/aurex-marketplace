import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Chat from "../../../components/Dashboard/Chat/Chat";

const ComprasChat: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/panel/compras");
  };

  if (!chatId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Chat no encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            No se pudo encontrar el chat solicitado.
          </p>
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Compras
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto h-screen">
        <Chat chatId={chatId} onBack={handleBack} />
      </div>
    </div>
  );
};

export default ComprasChat;
