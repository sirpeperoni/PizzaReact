import { useRef, useEffect } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import type { Chat, ChatMessage } from '../../types/chat.types';
import { MessageBubble } from '../shared/MessageBubble';
import { ChatInput } from '../shared/ChatInput';

interface ChatMessageThreadProps {
  chat: Chat;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onClose: () => void;
}

export const ChatMessageThread = ({ chat, messages, onSend, onClose }: ChatMessageThreadProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant='subtitle1' fontWeight='bold'>
            {chat.username}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {chat.userEmail}
          </Typography>
        </Box>
        <Button size='small' color='error' variant='outlined' onClick={onClose}>
          Закрыть запрос
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {messages.length === 0 && (
          <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', mt: 4 }}>
            Сообщений пока нет
          </Typography>
        )}
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            createdAt={msg.createdAt}
            isOwn={msg.senderRole === 'Admin'}
            senderLabel={chat.username}
          />
        ))}
        <div ref={bottomRef} />
      </Box>

      <Divider />
      <Box sx={{ p: 2, flexShrink: 0 }}>
        <ChatInput onSend={onSend} placeholder='Написать ответ...' />
      </Box>
    </Box>
  );
};
