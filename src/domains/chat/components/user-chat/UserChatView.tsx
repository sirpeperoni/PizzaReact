import { useRef, useEffect } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import type { Chat, ChatMessage } from '../../types/chat.types';
import { MessageBubble } from '../shared/MessageBubble';
import { ChatInput } from '../shared/ChatInput';

interface UserChatViewProps {
  chat: Chat;
  messages: ChatMessage[];
  userId: string;
  onSend: (text: string) => void;
}

export const UserChatView = ({ chat, messages, userId, onSend }: UserChatViewProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {chat.status === 'closed' && (
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
      {chat.status === 'open' && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <ChatInput onSend={onSend} placeholder='Написать сообщение...' />
          </Box>
        </>
      )}
    </>
  );
};
