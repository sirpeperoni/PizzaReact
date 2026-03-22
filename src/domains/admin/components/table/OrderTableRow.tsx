import { Box, TableCell, TableRow, Typography } from '@mui/material';
import type { HistoryOrder } from '../../../../shared/types/historyOrder';
import { StatusChip } from './StatusChip';
import { StatusSelect } from './StatusSelect';
import type { OrderStatus } from '../../types/types';
import { formatDate } from '../../utils/utils';

interface OrderTableRowProps {
  order: HistoryOrder;
  updatingOrderId: string | null;
  isLoading: boolean;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderTableRow = ({ order, updatingOrderId, isLoading, onStatusChange }: OrderTableRowProps) => {
  const isUpdating = updatingOrderId === order.id;

  return (
    <TableRow key={order.id} hover>
      <TableCell>
        <Typography variant='body2' fontWeight='medium'>
          #{order.id?.slice(-6) || 'N/A'}
        </Typography>
        <Typography variant='caption' color='text.secondary'>
          UID: {order.uid.slice(-6)}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant='body2'>{formatDate(order.orderDate)}</Typography>
      </TableCell>

      <TableCell>
        <Box sx={{ maxWidth: 300 }}>
          {order.items.map((item, idx) => (
            <Typography key={idx} variant='body2' noWrap>
              {item.name} × {item.quantity}
              <Typography component='span' variant='caption' color='text.secondary'>
                {' '}
                ({item.price.toLocaleString()} ₽)
              </Typography>
            </Typography>
          ))}
        </Box>
      </TableCell>

      <TableCell align='right'>
        <Typography variant='body2' fontWeight='bold'>
          {order.totalPrice.toLocaleString()} ₽
        </Typography>
      </TableCell>

      <TableCell>
        <StatusChip status={order.status as OrderStatus} isUpdating={isUpdating} />
      </TableCell>

      <TableCell>
        <StatusSelect
          currentStatus={order.status as OrderStatus}
          orderId={order.id!}
          isDisabled={isUpdating || isLoading}
          onStatusChange={newStatus => onStatusChange(order.id!, newStatus)}
        />
      </TableCell>
    </TableRow>
  );
};
