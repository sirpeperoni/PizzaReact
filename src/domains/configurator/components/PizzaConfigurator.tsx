import { Box } from '@mui/material';
import { PizzaScene } from './scene/PizzaScene';
import { ConfiguratorPanel } from './ui/ConfiguratorPanel';

export const PizzaConfigurator = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', lg: 'row' },
      minHeight: 'calc(100vh - 64px)',
    }}>
    {/* 3D Canvas */}
    <Box sx={{ flex: { lg: '0 0 65%' }, bgcolor: '#1a1a2e' }}>
      <PizzaScene />
    </Box>

    {/* Control Panel */}
    <Box
      sx={{
        flex: { lg: '0 0 35%' },
        overflowY: 'auto',
        maxHeight: { lg: 'calc(100vh - 64px)' },
        p: 2,
        bgcolor: 'background.default',
      }}>
      <ConfiguratorPanel />
    </Box>
  </Box>
);
