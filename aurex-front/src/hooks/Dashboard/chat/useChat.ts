import { Chat, Message } from "../../../interfaces/Chat";
import { useChatStore } from "./useChatStore";
import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export interface UseChat {
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  createChat: (orderId: string) => Promise<Chat>;
  getChatByOrder: (orderId: string) => Promise<void>;
  sendMessage: (chatId: string, text: string) => Promise<Message>;
  getMessages: (chatId: string, page?: number) => Promise<void>;
  clearChat: () => void;
}

export default function useChat(): UseChat {
  const {
    currentChat,
    messages,
    loading,
    setCurrentChat,
    setMessages,
    addMessage,
    setLoading,
    clearChat: clearChatStore,
  } = useChatStore();

  useEffect(() => {
    console.log("Current Chat:", currentChat);
    console.log("Messages:", messages);
  }, [currentChat, messages]);

  // Chat API functions
  const postChat = async (orderId: string): Promise<Chat> => {
    const response = await axios.post("/chat", { orderId });
    return response.data.chat;
  };

  const getChatByOrderAPI = async (
    orderId: string
  ): Promise<{ chat: Chat; messages: Message[] }> => {
    const response = await axios.get(`/chat/byOrder?orderId=${orderId}`);
    return response.data;
  };

  const postMessage = async (
    chatId: string,
    text: string
  ): Promise<Message> => {
    const response = await axios.post(`/message/${chatId}`, {
      text,
      type: "Cliente",
    });
    return response.data.data;
  };

  const getMessagesAPI = async (
    chatId: string,
    page: number = 1
  ): Promise<{ messages: Message[]; pagination: any }> => {
    const response = await axios.get(
      `/messages/${chatId}?page=${page}&limit=10`
    );
    return response.data;
  };

  // Chat operations
  async function createChat(orderId: string): Promise<Chat> {
    try {
      setLoading(true);
      const newChat = await postChat(orderId);
      setCurrentChat(newChat);
      Swal.fire("Chat Creado", "Chat creado exitosamente", "success");
      return newChat;
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al crear el chat, intenta más tarde", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getChatByOrder(orderId: string): Promise<void> {
    try {
      setLoading(true);
      const { chat, messages } = await getChatByOrderAPI(orderId);
      setCurrentChat(chat);
      setMessages(messages);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Error al obtener el chat, intenta más tarde",
        "error"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(chatId: string, text: string): Promise<Message> {
    try {
      const newMessage = await postMessage(chatId, text);
      addMessage(newMessage);
      return newMessage;
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Error al enviar el mensaje, intenta más tarde",
        "error"
      );
      throw error;
    }
  }

  async function getMessages(chatId: string, page: number = 1): Promise<void> {
    try {
      setLoading(true);
      const { messages: newMessages } = await getMessagesAPI(chatId, page);

      if (page === 1) {
        setMessages(newMessages);
      } else {
        setMessages([...messages, ...newMessages]);
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Error al obtener los mensajes, intenta más tarde",
        "error"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function clearChat(): void {
    clearChatStore();
  }

  return {
    currentChat,
    messages,
    loading,
    createChat,
    getChatByOrder,
    sendMessage,
    getMessages,
    clearChat,
  };
}
