import { Box, Slider, Typography } from '@mui/material';
import { useConfiguratorStore } from '../../stores/configuratorStore';

export const CheeseSlider = () => {
  const cheeseAmount = useConfiguratorStore(state => state.cheeseAmount);
  const setCheeseAmount = useConfiguratorStore(state => state.setCheeseAmount);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='subtitle2' fontWeight='bold'>
          Сыр
        </Typography>
        <Typography variant='subtitle2' color='text.secondary'>
          {cheeseAmount}%
        </Typography>
      </Box>
      <Slider
        value={cheeseAmount}
        onChange={(_e, val) => setCheeseAmount(val as number)}
        min={0}
        max={100}
        step={1}
        color='warning'
      />
    </>
  );
};
