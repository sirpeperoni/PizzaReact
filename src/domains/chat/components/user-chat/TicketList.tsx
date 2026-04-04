import { Box, Button, Chip, CircularProgress, Divider, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { Chat } from '../../types/chat.types';

interface TicketListProps {
  chats: Chat[];
  isLoading: boolean;
  onSelect: (chat: Chat) => void;
  onNew: () => void;
}

export const TicketList = ({ chats, isLoading, onSelect, onNew }: TicketListProps) => (
  <>
    <Box sx={{ p: 2 }}>
      <Button fullWidth variant='outlined' startIcon={<AddIcon />} onClick={onNew}>
        Новый запрос
      </Button>
    </Box>
    <Divider />
    {isLoading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <CircularProgress />
      </Box>
    ) : chats.length === 0 ? (
      <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', mt: 6 }}>
        У вас пока нет запросов
      </Typography>
    ) : (
      <List sx={{ flex: 1, overflowY: 'auto' }}>
        {chats.map(chat => (
          <ListItemButton key={chat.id} onClick={() => onSelect(chat)}>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant='body2'
                    fontWeight={chat.unreadByUser > 0 ? 'bold' : 'normal'}
                    noWrap
                    sx={{ flex: 1 }}>
                    {chat.subject}
                  </Typography>
                  <Chip
                    label={chat.status === 'open' ? 'Открыт' : 'Закрыт'}
                    size='small'
                    color={chat.status === 'open' ? 'success' : 'default'}
                  />
                  {chat.unreadByUser > 0 && <Chip label={chat.unreadByUser} size='small' color='error' />}
                </Box>
              }
              secondary={chat.lastMessage || 'Нет сообщений'}
            />
          </ListItemButton>
        ))}
      </List>
    )}
  </>
);
