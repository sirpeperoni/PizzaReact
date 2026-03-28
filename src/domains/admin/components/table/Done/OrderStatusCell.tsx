import { Box } from '@mui/material';
import type { OrderStatus } from '../../../types/types';
import { StatusChip } from '../shared/StatusChip';


interface OrderStatusCellProps {
  status: OrderStatus;
}

export const OrderStatusCell = ({ status }: OrderStatusCellProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <StatusChip status={status} />
    </Box>
  );
};