import React, { useState } from 'react';
import { Box } from '@mui/material';
import { AdminTabs } from '../../domains/admin/components/admin-tabs/AdminTabs';
import { TabPanel } from '../../domains/admin/components/tab-panel/TabPanel';
import { TableProgressOrders } from '../../domains/admin/components/table/progress-table/TableProgressOrders.tsx';
import { TableDoneOrders } from '../../domains/admin/components/table/done/TableDoneOrders.tsx';
import { AddNewGoodForm } from '../../domains/admin/components/add-new-good-form/AddNewGoodForm';
import { useAdminStore } from '../../domains/admin/stores/adminStore.ts';

export const Admin = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const resetDocs = useAdminStore(state => state.resetDocs);

  const handleChangeTab = (event: React.SyntheticEvent, index: number) => {
    resetDocs();
    setTabIndex(index);
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        display: 'flex',
        height: '100%',
      }}>
      <AdminTabs tabIndex={tabIndex} onTabChange={handleChangeTab} />
      <Box sx={{ width: '100%', overflowY: 'scroll' }}>
        <TabPanel value={tabIndex} index={0}>
          <TableProgressOrders />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <TableDoneOrders />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <AddNewGoodForm />
        </TabPanel>
      </Box>
    </Box>
  );
};
