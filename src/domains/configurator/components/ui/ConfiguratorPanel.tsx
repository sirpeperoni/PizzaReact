import { useMemo } from 'react';
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { useConfiguratorStore } from '../../stores/configuratorStore';
import { BASE_PRICES, INGREDIENT_KEYS, INGREDIENT_PRICES, SIZE_MULTIPLIERS } from '../../types/configurator.types';
import { DoughSelector } from './DoughSelector';
import { SauceSelector } from './SauceSelector';
import { CheeseSlider } from './CheeseSlider';
import { IngredientsGrid } from './IngredientsGrid';
import { SizeSelector } from './SizeSelector';

export const ConfiguratorPanel = () => {
  const { dough, size, ingredients, resetAll } = useConfiguratorStore();

  const price = useMemo(() => {
    const base = BASE_PRICES[dough] * SIZE_MULTIPLIERS[size];
    const extras = INGREDIENT_KEYS.filter(k => ingredients[k]).reduce((sum, k) => sum + INGREDIENT_PRICES[k], 0);
    return Math.round(base + extras);
  }, [dough, size, ingredients]);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%', overflowY: 'auto' }}>
      <Stack spacing={3}>
        <Typography variant='h5' fontWeight='bold'>
          Собери свою пиццу
        </Typography>

        <Divider />

        <DoughSelector />
        <SauceSelector />
        <CheeseSlider />
        <IngredientsGrid />
        <SizeSelector />

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='subtitle1'>Итого:</Typography>
          <Typography variant='h6' fontWeight='bold' color='warning.main'>
            {price} ₽
          </Typography>
        </Box>

        <Button variant='outlined' color='inherit' onClick={resetAll} fullWidth>
          Сбросить всё
        </Button>
      </Stack>
    </Paper>
  );
};
