import { Box, Typography } from '@mui/material';
import type { CartItem } from '../../../../cart/types/cart.types.ts';

interface OrderItemsCellProps {
  items: CartItem[];
}

export const OrderItemsCell = ({ items }: OrderItemsCellProps) => {
  return (
    <Box sx={{
      maxHeight: 200,
      overflowY: "auto",
      width: "100%",
      py: 1,
    }}>
      {items.map((item, idx) => (
        <Typography key={idx} variant='body2' noWrap>
          {item.name} × {item.quantity}
          <Typography component='span' variant='caption' color='text.secondary'>
            {' '}
            ({item.price.toLocaleString()} ₽)
          </Typography>
        </Typography>
      ))}
    </Box>
  );
};