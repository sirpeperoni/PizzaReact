import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useConfiguratorStore } from '../../stores/configuratorStore';
import type { DoughVariant } from '../../types/configurator.types';

export const DoughSelector = () => {
  const dough = useConfiguratorStore(state => state.dough);
  const setDough = useConfiguratorStore(state => state.setDough);

  return (
    <>
      <Typography variant='subtitle2' fontWeight='bold'>
        Тесто
      </Typography>
      <ToggleButtonGroup value={dough} exclusive onChange={(_e, val: DoughVariant) => val && setDough(val)} fullWidth size='small'>
        <ToggleButton value='thin'>Тонкое</ToggleButton>
        <ToggleButton value='traditional'>Традиционное</ToggleButton>
      </ToggleButtonGroup>
    </>
  );
};
