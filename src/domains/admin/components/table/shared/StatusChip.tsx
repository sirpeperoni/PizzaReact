import { Chip } from '@mui/material';
import { type ChipColor, type OrderStatus, statusConfig } from '../../../types/types';

interface StatusChipProps {
  status: OrderStatus;
}

export const StatusChip = ({ status }: StatusChipProps) => {
  const config = statusConfig[status];

  return <Chip label={config.label} color={config.color as ChipColor} size='small' sx={{ fontWeight: 'medium' }} />;
};
