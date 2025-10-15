import React from "react";
import { Message as MessageType } from "../../../interfaces/Chat";

interface MessageProps {
  message: MessageType;
  isOwn: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isOwn }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderContent = () => {
    switch (message.type) {
      case "text":
        return (
          <div className="whitespace-pre-wrap break-words">
            {message.text}
          </div>
        );
      case "image":
        return (
          <div className="relative">
            <img
              src={message.text}
              alt="Imagen"
              className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.text, "_blank")}
            />
          </div>
        );
      case "video":
        return (
          <div className="relative">
            <video
              src={message.text}
              controls
              className="max-w-xs rounded-lg"
              preload="metadata"
            >
              Tu navegador no soporta la reproducción de video.
            </video>
          </div>
        );
      default:
        return (
          <div className="whitespace-pre-wrap break-words">
            {message.text}
          </div>
        );
    }
  };

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-gray-200 text-gray-800 rounded-bl-sm"
        }`}
      >
        {renderContent()}
        <div
          className={`text-xs mt-1 ${
            isOwn ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Message;

