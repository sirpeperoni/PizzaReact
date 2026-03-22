import React from 'react';
import { Box } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const TabPanel = ({ index, value, children }: TabPanelProps) => {
  return (
    <Box
      sx={{ display: value !== index ? 'none' : 'block' }}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      role='tabpanel'>
      {value === index && <Box>{children}</Box>}
    </Box>
  );
};
