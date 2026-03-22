import { Box, Typography } from '@mui/material';

export const NoOrders = () => {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant='h6' color='text.secondary'>
        У вас пока нет заказов
      </Typography>
    </Box>
  );
};
