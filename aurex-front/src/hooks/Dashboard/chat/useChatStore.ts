import { Chat, Message } from "../../../interfaces/Chat";
import { create } from "zustand";

interface ChatState {
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  setCurrentChat: (chat: Chat | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentChat: null,
  messages: [],
  loading: false,
  setCurrentChat: (chat) => set({ currentChat: chat }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setLoading: (loading) => set({ loading }),
  clearChat: () => set({ currentChat: null, messages: [] }),
}));
