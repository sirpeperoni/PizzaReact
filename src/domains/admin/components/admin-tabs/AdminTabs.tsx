import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';

interface AdminTabsProps {
  tabIndex: number;
  onTabChange: (event: React.SyntheticEvent, index: number) => void;
}

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
};

export const AdminTabs = ({ tabIndex, onTabChange }: AdminTabsProps) => {
  return (
    <Box
      sx={{
        borderRight: '1px solid black',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Tabs orientation='vertical' value={tabIndex} onChange={onTabChange}>
        <Tab sx={{ borderBottom: '1px solid black' }} label='Подтверждение заказов' {...a11yProps(0)} />
        <Tab sx={{ borderBottom: '1px solid black' }} label='Выполненные заказы' {...a11yProps(1)} />
        <Tab sx={{ borderBottom: '1px solid black' }} label='Добавить новый товар' {...a11yProps(2)} />
        <Tab sx={{ borderBottom: '1px solid black' }} label='Чат с пользователями' {...a11yProps(3)} />
      </Tabs>
    </Box>
  );
};
