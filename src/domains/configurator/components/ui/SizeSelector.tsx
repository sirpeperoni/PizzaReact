import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useConfiguratorStore } from '../../stores/configuratorStore';
import type { PizzaSize } from '../../types/configurator.types';

export const SizeSelector = () => {
  const size = useConfiguratorStore(state => state.size);
  const setSize = useConfiguratorStore(state => state.setSize);

  return (
    <>
      <Typography variant='subtitle2' fontWeight='bold'>
        Размер
      </Typography>
      <ToggleButtonGroup value={size} exclusive onChange={(_e, val: PizzaSize) => val && setSize(val)} fullWidth size='small'>
        <ToggleButton value='small'>25 см</ToggleButton>
        <ToggleButton value='medium'>30 см</ToggleButton>
        <ToggleButton value='large'>35 см</ToggleButton>
      </ToggleButtonGroup>
    </>
  );
};
