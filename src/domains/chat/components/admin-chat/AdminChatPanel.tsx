import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useChatStore } from '../../stores/chatStore';
import { useAuthStore } from '../../../../domains/auth/stores/authStore';
import { ChatList } from './ChatList';
import { ChatMessageThread } from './ChatMessageThread';

export const AdminChatPanel = () => {
  const user = useAuthStore(state => state.user);
  const { chats, messages, currentChatId, subscribeOpenChats, subscribeMessages, selectChat, sendMessage, markRead, closeChat } =
    useChatStore();

  useEffect(() => {
    const unsubscribe = subscribeOpenChats();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentChatId) return;
    const unsubscribe = subscribeMessages(currentChatId);
    markRead('Admin');
    return () => unsubscribe();
  }, [currentChatId]);

  const handleSend = async (text: string) => {
    if (!user?.uid) return;
    await sendMessage(text, user.uid, 'Admin');
  };

  const handleClose = async () => {
    if (!currentChatId) return;
    await closeChat(currentChatId);
  };

  const currentChat = chats.find(c => c.id === currentChatId);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
      <ChatList chats={chats} selectedId={currentChatId} onSelect={selectChat} />

      {currentChat ? (
        <ChatMessageThread chat={currentChat} messages={messages} onSend={handleSend} onClose={handleClose} />
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color='text.secondary'>Выберите диалог</Typography>
        </Box>
      )}
    </Box>
  );
};
