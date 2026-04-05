import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useConfiguratorStore } from '../../stores/configuratorStore';
import type { SauceVariant } from '../../types/configurator.types';

export const SauceSelector = () => {
  const sauce = useConfiguratorStore(state => state.sauce);
  const setSauce = useConfiguratorStore(state => state.setSauce);

  return (
    <>
      <Typography variant='subtitle2' fontWeight='bold'>
        Соус
      </Typography>
      <ToggleButtonGroup value={sauce} exclusive onChange={(_e, val: SauceVariant) => val && setSauce(val)} fullWidth size='small'>
        <ToggleButton value='tomato'>Томатный</ToggleButton>
        <ToggleButton value='cream'>Сливочный</ToggleButton>
        <ToggleButton value='pesto'>Песто</ToggleButton>
      </ToggleButtonGroup>
    </>
  );
};
