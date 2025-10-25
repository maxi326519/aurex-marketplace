import React from "react";
import { Chat } from "../../../interfaces/Chat";
import { ArrowLeft, User, Store } from "lucide-react";

interface ChatHeaderProps {
  chat: Chat;
  onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, onBack }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "pending":
        return "Pendiente";
      case "closed":
        return "Cerrado";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Volver"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                chat.state
              )}`}
            />
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">
                Vendedor
              </h3>
              <span
                className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(
                  chat.state
                )}`}
              >
                {getStatusText(chat.state)}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Store className="w-4 h-4" />
              <span>Negocio</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        Chat #{chat.id}
      </div>
    </div>
  );
};

export default ChatHeader;
