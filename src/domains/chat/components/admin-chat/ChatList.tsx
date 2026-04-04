import { Badge, Box, Divider, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import type { Chat } from '../../types/chat.types';

interface ChatListProps {
  chats: Chat[];
  selectedId: string | null;
  onSelect: (chatId: string) => void;
}

export const ChatList = ({ chats, selectedId, onSelect }: ChatListProps) => (
  <Box
    sx={{
      borderRight: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minHeight: 0,
    }}>
    <Typography variant='subtitle1' fontWeight='bold' sx={{ p: 2 }}>
      Диалоги
    </Typography>
    <Divider />
    {chats.length === 0 ? (
      <Typography variant='body2' color='text.secondary' sx={{ p: 2 }}>
        Нет активных диалогов
      </Typography>
    ) : (
      <List dense sx={{ overflowY: 'auto', flex: 1 }}>
        {chats.map(chat => (
          <ListItemButton key={chat.id} selected={chat.id === selectedId} onClick={() => onSelect(chat.id)}>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='body2' fontWeight={chat.unreadByAdmin > 0 ? 'bold' : 'normal'} noWrap>
                    {chat.username}
                  </Typography>
                  {chat.unreadByAdmin > 0 && <Badge badgeContent={chat.unreadByAdmin} color='error' sx={{ ml: 1 }} />}
                </Box>
              }
              secondary={
                <Typography variant='caption' color='text.secondary' noWrap display='block'>
                  {chat.lastMessage || 'Нет сообщений'}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>
    )}
  </Box>
);
