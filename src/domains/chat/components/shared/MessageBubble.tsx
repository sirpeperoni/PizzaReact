import { Box, Paper, Typography } from '@mui/material';

interface MessageBubbleProps {
  text: string;
  createdAt: number;
  isOwn: boolean;
  senderLabel?: string;
}

export const MessageBubble = ({ text, createdAt, isOwn, senderLabel }: MessageBubbleProps) => (
  <Box sx={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
    <Paper
      elevation={1}
      sx={{
        px: 1.5,
        py: 1,
        maxWidth: '75%',
        bgcolor: isOwn ? 'warning.main' : 'grey.100',
        color: isOwn ? 'white' : 'text.primary',
        borderRadius: isOwn ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
      }}>
      {!isOwn && senderLabel && (
        <Typography variant='caption' fontWeight='bold' display='block'>
          {senderLabel}
        </Typography>
      )}
      <Typography variant='body2'>{text}</Typography>
      <Typography variant='caption' sx={{ opacity: 0.7, display: 'block', textAlign: 'right', mt: 0.25 }}>
        {new Date(createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
      </Typography>
    </Paper>
  </Box>
);
