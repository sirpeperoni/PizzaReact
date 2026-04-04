import { useState, useEffect } from 'react';
import { Box, Divider, Drawer, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUserChat } from '../../hooks/useUserChat';
import { TicketList } from './TicketList';
import { NewTicketForm } from './NewTicketForm';
import { UserChatView } from './UserChatView';
import type { Chat } from '../../types/chat.types';

interface UserChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

type View = 'list' | 'new' | 'chat';

const titles: Record<View, string> = {
  list: 'Мои запросы',
  new: 'Новый запрос',
  chat: '',
};

export const UserChatDrawer = ({ open, onClose }: UserChatDrawerProps) => {
  const { userChats, messages, currentChatId, isLoading, handleCreateChat, handleSend, selectChat, userId } =
    useUserChat(open);
  const [view, setView] = useState<View>('list');

  useEffect(() => {
    if (!open) setView('list');
  }, [open]);

  const currentChat = userChats.find(c => c.id === currentChatId);

  const handleSelectChat = (chat: Chat) => {
    selectChat(chat.id);
    setView('chat');
  };

  const handleSubmitNew = async (subject: string) => {
    await handleCreateChat(subject);
    setView('chat');
  };

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: '100%', sm: 400 }, display: 'flex', flexDirection: 'column' } } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 1 }}>
        {view !== 'list' && (
          <IconButton size='small' onClick={() => setView('list')}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant='h6' fontWeight='bold' sx={{ flex: 1 }}>
          {view === 'chat' ? (currentChat?.subject ?? 'Чат') : titles[view]}
        </Typography>
        <IconButton size='small' onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {view === 'list' && (
        <TicketList chats={userChats} isLoading={isLoading} onSelect={handleSelectChat} onNew={() => setView('new')} />
      )}

      {view === 'new' && <NewTicketForm isLoading={isLoading} onSubmit={handleSubmitNew} />}

      {view === 'chat' && currentChat && (
        <UserChatView chat={currentChat} messages={messages} userId={userId ?? ''} onSend={handleSend} />
      )}
    </Drawer>
  );
};
