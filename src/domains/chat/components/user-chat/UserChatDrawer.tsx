import { useRef, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { useUserChat } from '../../hooks/useUserChat';
import { MessageBubble } from '../shared/MessageBubble';
import { ChatInput } from '../shared/ChatInput';
import type { Chat } from '../../types/chat.types';

interface UserChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

type View = 'list' | 'chat' | 'new';

export const UserChatDrawer = ({ open, onClose }: UserChatDrawerProps) => {
  const { userChats, messages, currentChatId, isLoading, handleCreateChat, handleSend, selectChat, userId } =
    useUserChat(open);
  const [view, setView] = useState<View>('list');
  const [subject, setSubject] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When drawer closes — reset to list view
  useEffect(() => {
    if (!open) setView('list');
  }, [open]);

  const handleSelectChat = (chat: Chat) => {
    selectChat(chat.id);
    setView('chat');
  };

  const handleSubmitNew = async () => {
    if (!subject.trim()) return;
    await handleCreateChat(subject.trim());
    setSubject('');
    setView('chat');
  };

  const currentChat = userChats.find(c => c.id === currentChatId);

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: '100%', sm: 400 }, display: 'flex', flexDirection: 'column' } } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 1 }}>
        {view !== 'list' && (
          <IconButton size='small' onClick={() => setView('list')}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant='h6' fontWeight='bold' sx={{ flex: 1 }}>
          {view === 'list' && 'Мои запросы'}
          {view === 'new' && 'Новый запрос'}
          {view === 'chat' && (currentChat?.subject ?? 'Чат')}
        </Typography>
        <IconButton size='small' onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* List view */}
      {view === 'list' && (
        <>
          <Box sx={{ p: 2 }}>
            <Button fullWidth variant='outlined' startIcon={<AddIcon />} onClick={() => setView('new')}>
              Новый запрос
            </Button>
          </Box>
          <Divider />
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <CircularProgress />
            </Box>
          ) : userChats.length === 0 ? (
            <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', mt: 6 }}>
              У вас пока нет запросов
            </Typography>
          ) : (
            <List sx={{ flex: 1, overflowY: 'auto' }}>
              {userChats.map(chat => (
                <ListItemButton key={chat.id} onClick={() => handleSelectChat(chat)}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant='body2' fontWeight={chat.unreadByUser > 0 ? 'bold' : 'normal'} noWrap sx={{ flex: 1 }}>
                          {chat.subject}
                        </Typography>
                        <Chip
                          label={chat.status === 'open' ? 'Открыт' : 'Закрыт'}
                          size='small'
                          color={chat.status === 'open' ? 'success' : 'default'}
                        />
                        {chat.unreadByUser > 0 && (
                          <Chip label={chat.unreadByUser} size='small' color='error' />
                        )}
                      </Box>
                    }
                    secondary={chat.lastMessage || 'Нет сообщений'}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </>
      )}

      {/* New request view */}
      {view === 'new' && (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant='body2' color='text.secondary'>
            Опишите вашу проблему — мы ответим как можно скорее
          </Typography>
          <TextField
            fullWidth
            label='Тема запроса'
            placeholder='Например: не могу оформить заказ'
            value={subject}
            onChange={e => setSubject(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmitNew()}
            autoFocus
          />
          <Button variant='contained' color='warning' disabled={!subject.trim() || isLoading} onClick={handleSubmitNew}>
            {isLoading ? <CircularProgress size={20} color='inherit' /> : 'Создать запрос'}
          </Button>
        </Box>
      )}

      {/* Chat view */}
      {view === 'chat' && (
        <>
          {currentChat?.status === 'closed' && (
            <Box sx={{ px: 2, py: 1, bgcolor: 'grey.100' }}>
              <Typography variant='caption' color='text.secondary'>
                Этот запрос закрыт
              </Typography>
            </Box>
          )}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {messages.length === 0 && (
              <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', mt: 4 }}>
                Напишите сообщение — мы ответим как можно скорее
              </Typography>
            )}
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                text={msg.text}
                createdAt={msg.createdAt}
                isOwn={msg.senderId === userId}
                senderLabel='Поддержка'
              />
            ))}
            <div ref={bottomRef} />
          </Box>
          {currentChat?.status === 'open' && (
            <>
              <Divider />
              <Box sx={{ p: 2 }}>
                <ChatInput onSend={handleSend} placeholder='Написать сообщение...' />
              </Box>
            </>
          )}
        </>
      )}
    </Drawer>
  );
};
