import { Box } from '@mui/material';
import type { CartItem } from '../../../../cart/types/cart.types';
import { OrderItem } from '../order-item/OrderItem';

interface OrderItemsListProps {
  items: CartItem[];
}

export const OrderItemsList = ({ items }: OrderItemsListProps) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        alignContent: 'flex-start',
        overflowY: 'auto',
        mb: 1,
      }}>
      {items.map(pizza => (
        <OrderItem pizza={pizza} key={pizza.id} />
      ))}
    </Box>
  );
};
