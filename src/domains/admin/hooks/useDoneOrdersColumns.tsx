import { useMemo } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import type { HistoryOrder } from '../../../shared/types/historyOrder';
import { formatDate } from '../utils/utils';
import { OrderItemsCell } from '../components/table/shared/OrderItemsCell';
import type { CartItem } from '../../cart/types/cart.types';
import { OrderStatusCell } from '../components/table/done/OrderStatusCell';


export const useDoneOrdersColumns = (): GridColDef<HistoryOrder>[] => {
  return useMemo(() => [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 100, 
      valueGetter: (value: string) => value.slice(0, 6) 
    },
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
      renderCell: (params) => <OrderItemsCell items={params.value as CartItem[]} />,
    },
    { 
      field: 'totalPrice', 
      headerName: 'Сумма', 
      width: 100, 
      valueGetter: (value: number) => `${value} р.` 
    },
    {
      field: 'status',
      headerName: 'Статус',
      width: 150,
      renderCell: (params) => <OrderStatusCell status={params.row.status} />,
    },
  ], []);
};