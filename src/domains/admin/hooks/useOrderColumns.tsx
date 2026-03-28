// hooks/useOrderColumns.ts
import { useMemo } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import type { OrderStatus } from '../types/types';
import type { HistoryOrder } from '../../../shared/types/historyOrder';
import { formatDate } from '../utils/utils';
import { OrderItemsCell } from '../components/table/shared/OrderItemsCell';
import type { CartItem } from '../../cart/types/cart.types';
import { OrderStatusSelect } from '../components/table/progress-table/OrderStatusSelect';


export const useOrderColumns = (
  updatingOrderId: string | null,
  onStatusChange: (userId: string, orderId: string | undefined, newStatus: OrderStatus) => Promise<void>
): GridColDef<HistoryOrder>[] => {
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
      renderCell: (params) => (
        <OrderStatusSelect
          orderId={params.row.id ?? ""}
          userId={params.row.uid}
          currentStatus={params.row.status}
          isUpdating={updatingOrderId === params.row.id}
          onStatusChange={onStatusChange}
        />
      ),
    },
  ], [updatingOrderId, onStatusChange]);
};