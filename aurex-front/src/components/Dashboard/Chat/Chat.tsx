import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Image, Video } from "lucide-react";
import Message from "./Message";
import ChatHeader from "./ChatHeader";
import { Message as MessageType } from "../../../interfaces/Chat";
import useChat from "../../../hooks/Dashboard/chat/useChat";

interface ChatProps {
  chatId: string;
  onBack: () => void;
}

const Chat: React.FC<ChatProps> = ({ chatId, onBack }) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    currentChat,
    messages,
    loading,
    sendMessage,
    getMessages,
  } = useChat();

  // Cargar mensajes cuando se monta el componente
  useEffect(() => {
    if (chatId) {
      getMessages(chatId);
    }
  }, [chatId]);

  // Scroll automático al final de los mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    try {
      await sendMessage(currentChat.id, newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Por ahora solo mostramos un mensaje de que la funcionalidad no está implementada
    alert("La funcionalidad de subir archivos aún no está implementada");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (loading && !currentChat) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">No se pudo cargar el chat</p>
          <button
            onClick={onBack}
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader chat={currentChat} onBack={onBack} />
      
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p>No hay mensajes aún</p>
              <p className="text-sm">Envía el primer mensaje para comenzar la conversación</p>
            </div>
          </div>
        ) : (
          messages.map((message: MessageType) => (
            <Message
              key={message.id}
              message={message}
              isOwn={message.type === "Cliente"}
            />
          ))
        )}
        
        
        <div ref={messagesEndRef} />
      </div>

      {/* Área de entrada de mensajes */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[40px] max-h-[120px]"
              rows={1}
            />
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Adjuntar archivo"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Subir imagen"
            >
              <Image className="w-5 h-5" />
            </button>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Subir video"
            >
              <Video className="w-5 h-5" />
            </button>
            
            <button
              type="submit"
              disabled={!newMessage.trim() || loading}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Enviar mensaje"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          className="hidden"
          aria-label="Subir archivo"
        />
      </div>
    </div>
  );
};

export default Chat;
