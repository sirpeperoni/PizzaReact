import { Badge, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useChatStore } from '../../../domains/chat/stores/chatStore';

interface ChatButtonProps {
  onClick: () => void;
}

export const ChatButton = ({ onClick }: ChatButtonProps) => {
  const unreadCount = useChatStore(state => state.userUnreadCount);

  return (
    <IconButton onClick={onClick} sx={{ ml: 1 }} color='inherit'>
      <Badge badgeContent={unreadCount} color='error'>
        <ChatIcon />
      </Badge>
    </IconButton>
  );
};
