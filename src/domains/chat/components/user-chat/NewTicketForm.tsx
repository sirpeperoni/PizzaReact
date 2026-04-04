import { useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';

interface NewTicketFormProps {
  isLoading: boolean;
  onSubmit: (subject: string) => Promise<void>;
}

export const NewTicketForm = ({ isLoading, onSubmit }: NewTicketFormProps) => {
  const [subject, setSubject] = useState('');

  const handleSubmit = async () => {
    if (!subject.trim()) return;
    await onSubmit(subject.trim());
    setSubject('');
  };

  return (
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
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        autoFocus
      />
      <Button variant='contained' color='warning' disabled={!subject.trim() || isLoading} onClick={handleSubmit}>
        {isLoading ? <CircularProgress size={20} color='inherit' /> : 'Создать запрос'}
      </Button>
    </Box>
  );
};
