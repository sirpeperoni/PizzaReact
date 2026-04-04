import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ChatState } from '../types/chat.types';
import { chatService } from '../services/chatService';
import type { Unsubscribe } from 'firebase/firestore';

interface ChatStore extends ChatState {
  userUnreadCount: number;
  createChat: (userId: string, username: string, userEmail: string, subject: string) => Promise<string>;
  sendMessage: (text: string, senderId: string, senderRole: 'User' | 'Admin') => Promise<void>;
  subscribeMessages: (chatId: string) => Unsubscribe;
  subscribeOpenChats: () => Unsubscribe;
  subscribeUserChats: (userId: string) => Unsubscribe;
  selectChat: (chatId: string) => void;
  closeChat: (chatId: string) => Promise<void>;
  markRead: (role: 'User' | 'Admin') => Promise<void>;
  clearError: () => void;
}

export const useChatStore = create<ChatStore>()(
  devtools(
    (set, get) => ({
      messages: [],
      chats: [],
      userChats: [],
      currentChatId: null,
      isLoading: false,
      error: null,
      userUnreadCount: 0,

      createChat: async (userId, username, userEmail, subject) => {
        set({ isLoading: true, error: null });
        try {
          const chatId = await chatService.createChat(userId, username, userEmail, subject);
          set({ currentChatId: chatId, isLoading: false });
          return chatId;
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Ошибка создания запроса';
          set({ error, isLoading: false });
          throw err;
        }
      },

      sendMessage: async (text, senderId, senderRole) => {
        const { currentChatId } = get();
        if (!currentChatId) return;
        try {
          await chatService.sendMessage(currentChatId, text, senderId, senderRole);
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Ошибка отправки сообщения';
          set({ error });
        }
      },

      subscribeMessages: (chatId: string) => {
        return chatService.subscribeToMessages(chatId, messages => {
          set({ messages });
        });
      },

      subscribeOpenChats: () => {
        return chatService.subscribeToOpenChats(chats => {
          set({ chats });
        });
      },

      subscribeUserChats: (userId: string) => {
        return chatService.subscribeToUserChats(userId, userChats => {
          const userUnreadCount = userChats.reduce((sum, c) => sum + c.unreadByUser, 0);
          set({ userChats, userUnreadCount });
        });
      },

      selectChat: (chatId: string) => {
        if (get().currentChatId === chatId) return;
        set({ currentChatId: chatId, messages: [] });
      },

      closeChat: async (chatId: string) => {
        try {
          await chatService.closeChat(chatId);
          set(state => ({
            chats: state.chats.filter(c => c.id !== chatId),
            currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
            messages: state.currentChatId === chatId ? [] : state.messages,
          }));
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Ошибка закрытия запроса';
          set({ error });
        }
      },

      markRead: async (role) => {
        const { currentChatId } = get();
        if (!currentChatId) return;
        try {
          if (role === 'User') {
            await chatService.markReadByUser(currentChatId);
          } else {
            await chatService.markReadByAdmin(currentChatId);
          }
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Ошибка';
          set({ error });
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'chat-store' },
  ),
);
