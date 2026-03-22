import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useAdminStore } from '../../stores/adminStore';
import { useEffect, useMemo, useState } from 'react';
import { OrderStatsChips } from './OrderStatsChips';
import { OrderTableRow } from './OrderTableRow';
import type { OrderStatus } from '../../types/types';
import { calculateStats, formatDate } from '../../utils/utils';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { HistoryOrder } from '../../../../shared/types/historyOrder.ts';
import type { CartItem } from '../../../cart/types/cart.types.ts';
import { StatusChip } from './StatusChip.tsx';

const useColumns = (updatingOrderId: string | null): GridColDef<HistoryOrder>[] => {
  return [
    { field: 'id', headerName: 'ID', width: 100, valueGetter: (value: string) => value.slice(0, 6) },
    {
      field: 'orderDate',
      headerName: 'Дата',
      width: 250,
      valueGetter: (value: number) => formatDate(value),
    },
    {
      field: 'items',
      headerName: 'Товары',
      width: 200,
      renderCell: valueGetter => {
        return (
          <>
            {(valueGetter.value as CartItem[]).map((item, idx) => (
              <Typography key={idx} variant='body2' noWrap>
                {item.name} × {item.quantity}
                <Typography component='span' variant='caption' color='text.secondary'>
                  {' '}
                  ({item.price.toLocaleString()} ₽)
                </Typography>
              </Typography>
            ))}
          </>
        );
      },
    },
    { field: 'totalPrice', headerName: 'Сумма', width: 100, valueGetter: (value: number) => `${value} р.` },
    {
      field: 'status',
      headerName: 'Статус',
      width: 150,
      renderCell: valueGetter => <StatusChip status={valueGetter.row.status} isUpdating={updatingOrderId === valueGetter.row.id} />,
    },
  ];
};

const paginationModel = { page: 0, pageSize: 5 };

export const TableProgressOrders = () => {
  const isLoading = useAdminStore(state => state.isLoading);
  const progressOrders = useAdminStore(state => state.progressOrders);
  const error = useAdminStore(state => state.error);
  const totalOrders = useAdminStore(state => state.totalProgressOrders);
  const stats = calculateStats(progressOrders);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const columns = useColumns(updatingOrderId);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const updateOrderStatus = useAdminStore(state => state.updateOrderStatus);

  const fetchProgressOrders = useAdminStore(state => state.fetchProgressOrders);

  const handleStatusChange = async (userId: string, orderId: string, newStatus: OrderStatus) => {
    if (!orderId) return;

    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(userId, orderId, newStatus);
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    void fetchProgressOrders(newPage > page ? 'next' : 'prev');
    setPage(newPage);
  };

  useEffect(() => {
    void fetchProgressOrders();
  }, []);

  // const paginatedOrders = useMemo(() => {
  //   return progressOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  // }, [progressOrders, page, rowsPerPage]);

  return (
    <Box sx={{ height: '100%' }}>
      <OrderStatsChips stats={stats} />

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer
        sx={{
          maxHeight: 'calc(100vh - 135px)',
          overflow: 'auto',
        }}
        component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID Заказа</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Дата</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Товары</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align='right'>
                Сумма
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Статус</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Изменить статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align='center' sx={{ py: 4 }}>
                  <CircularProgress />
                  <Typography variant='body2' sx={{ mt: 1 }}>
                    Загрузка заказов...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : progressOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align='center' sx={{ py: 4 }}>
                  <Typography variant='body2' color='text.secondary'>
                    Нет активных заказов
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              progressOrders.map(order => (
                <OrderTableRow
                  key={order.id}
                  order={order}
                  updatingOrderId={updatingOrderId}
                  isLoading={isLoading}
                  onStatusChange={(orderId, newStatus) => handleStatusChange(order.uid, orderId, newStatus)}
                />
              ))
            )}
          </TableBody>
        </Table>

        <Box
          sx={{
            position: 'sticky',
            bottom: -2,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            zIndex: 1,
          }}>
          <TablePagination
            component='div'
            rowsPerPageOptions={[10]}
            count={totalOrders}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            labelRowsPerPage=''
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
          />
        </Box>
      </TableContainer>
      <Paper>
        <DataGrid
          rows={progressOrders}
          columns={columns}
          loading={isLoading}
          pagination
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
        />
      </Paper>
    </Box>
  );
};
