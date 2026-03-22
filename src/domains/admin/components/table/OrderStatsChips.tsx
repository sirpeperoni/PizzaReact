import { Chip, Stack } from '@mui/material';
import { CheckCircle, Kitchen, LocalShipping, Restaurant } from '@mui/icons-material';
import type { OrderStats } from '../../types/types';

interface OrderStatsChipsProps {
  stats: OrderStats;
}

export const OrderStatsChips = ({ stats }: OrderStatsChipsProps) => {
  return (
    <Stack direction='row' spacing={2} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Chip icon={<Restaurant />} label={`Всего: ${stats.total}`} variant='outlined' />
      <Chip icon={<Kitchen />} label={`Готовятся: ${stats.cooking}`} color='warning' variant='outlined' />
      <Chip icon={<CheckCircle />} label={`Готовы: ${stats.ready}`} color='info' variant='outlined' />
      <Chip icon={<LocalShipping />} label={`В доставке: ${stats.in_delivery}`} color='primary' variant='outlined' />
    </Stack>
  );
};
