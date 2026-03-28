import { Box, CircularProgress, FormControl, MenuItem, Select } from '@mui/material';
import { StatusChip } from '../shared/StatusChip.tsx';
import type { OrderStatus } from '../../../types/types.ts';

interface OrderStatusSelectProps {
  orderId: string;
  userId: string;
  currentStatus: OrderStatus;
  isUpdating: boolean;
  onStatusChange: (userId: string, orderId: string, newStatus: OrderStatus) => Promise<void>;
}

export const OrderStatusSelect = ({ 
  orderId, 
  userId, 
  currentStatus, 
  isUpdating, 
  onStatusChange 
}: OrderStatusSelectProps) => {
  if (isUpdating) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <FormControl size="small" fullWidth>
      <Select
        value={currentStatus}
        onChange={(e) => onStatusChange(userId, orderId, e.target.value)}
        autoFocus
        size="small"
        sx={{ minWidth: 120 }}
      >
        <MenuItem value='cooking'>
          <StatusChip status={"cooking"} />
        </MenuItem>
        <MenuItem value='ready'>
          <StatusChip status={"ready"} />
        </MenuItem>
        <MenuItem value='in_delivery'>
          <StatusChip status={"in_delivery"} />
        </MenuItem>
        <MenuItem value='delivered'>
          <StatusChip status={"delivered"} />
        </MenuItem>
      </Select>
    </FormControl>
  );
};