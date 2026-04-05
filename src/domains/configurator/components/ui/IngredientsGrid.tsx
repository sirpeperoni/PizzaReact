import { Box, Chip, Typography } from '@mui/material';
import { useConfiguratorStore } from '../../stores/configuratorStore';
import { INGREDIENT_KEYS, INGREDIENT_LABELS } from '../../types/configurator.types';

export const IngredientsGrid = () => {
  const ingredients = useConfiguratorStore(state => state.ingredients);
  const toggleIngredient = useConfiguratorStore(state => state.toggleIngredient);

  return (
    <>
      <Typography variant='subtitle2' fontWeight='bold'>
        Начинки
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {INGREDIENT_KEYS.map(key => (
          <Chip
            key={key}
            label={INGREDIENT_LABELS[key]}
            onClick={() => toggleIngredient(key)}
            color={ingredients[key] ? 'warning' : 'default'}
            variant={ingredients[key] ? 'filled' : 'outlined'}
            clickable
          />
        ))}
      </Box>
    </>
  );
};
