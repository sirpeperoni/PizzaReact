import { Box, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { Straighten } from '@mui/icons-material';

interface PricesSectionProps {
  watchSizes: string[];
  watchPrices: number[];
  updatePrice: (index: number, value: string) => void;
  isSubmitting: boolean;
}

export const PricesSection = ({ watchSizes, watchPrices, updatePrice, isSubmitting }: PricesSectionProps) => {
  return (
    <>
      <Typography variant='h6' gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Straighten /> Размеры и цены
      </Typography>
      <Stack spacing={2}>
        {watchSizes.map((size, index) => (
          <Box key={index} display='flex' gap={2} alignItems='center'>
            <TextField size='small' label={`Размер ${index + 1}`} value={size} disabled={true} sx={{ flex: 1 }} />
            <TextField
              size='small'
              type='number'
              label='Цена (₽)'
              value={watchPrices[index] || 0}
              onChange={e => updatePrice(index, e.target.value)}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: <InputAdornment position='start'>₽</InputAdornment>,
              }}
              sx={{ width: 150 }}
            />
          </Box>
        ))}
      </Stack>
    </>
  );
};
