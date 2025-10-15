import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Chat from "../../../components/Dashboard/Chat/Chat";
import useChat from "../../../hooks/Dashboard/chat/useChat";
import { ArrowLeft } from "lucide-react";

const ComprasChat: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { getChatByOrder, currentChat, loading } = useChat();

  /*   useEffect(() => {
    if (chatId) {
      // Si tenemos un chatId, intentamos obtener el chat por orden
      getChatByOrder(chatId);
    }
  }, []); */

  const handleBack = () => {
    navigate("/panel/compras");
  };

  /*   if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando chat...</p>
        </div>
      </div>
    );
  } */

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
