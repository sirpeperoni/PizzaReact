import { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ChatInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
}

export const ChatInput = ({ onSend, placeholder = 'Написать сообщение...' }: ChatInputProps) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText('');
    onSend(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <TextField
      fullWidth
      size='small'
      placeholder={placeholder}
      value={text}
      onChange={e => setText(e.target.value)}
      onKeyDown={handleKeyDown}
      multiline
      maxRows={3}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton onClick={handleSend} disabled={!text.trim()} color='warning' size='small'>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
