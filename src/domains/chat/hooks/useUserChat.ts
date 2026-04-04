import { useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../../../domains/auth/stores/authStore';

export const useUserChat = (open: boolean) => {
  const user = useAuthStore(state => state.user);
  const { userChats, messages, currentChatId, isLoading, createChat, sendMessage, subscribeMessages, subscribeUserChats, selectChat, markRead } =
    useChatStore();

  useEffect(() => {
    if (!open || !user?.uid) return;
    const unsubscribe = subscribeUserChats(user.uid);
    return () => unsubscribe();
  }, [open, user?.uid]);

  useEffect(() => {
    if (!open || !currentChatId) return;
    const unsubscribe = subscribeMessages(currentChatId);
    markRead('User');
    return () => unsubscribe();
  }, [open, currentChatId]);

  const handleCreateChat = async (subject: string) => {
    if (!user?.uid || !user.username || !user.email) return;
    await createChat(user.uid, user.username, user.email, subject);
  };

  const handleSend = async (text: string) => {
    if (!user?.uid) return;
    await sendMessage(text, user.uid, 'User');
  };

  return { userChats, messages, currentChatId, isLoading, handleCreateChat, handleSend, selectChat, userId: user?.uid };
};
