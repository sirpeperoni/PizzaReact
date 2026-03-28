import { useEffect } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import { OrderTable } from './OrderTable';
import { usePaginationHandler } from '../../hooks/usePaginationHandler';
import type { WhereFilterOp } from 'firebase/firestore';


interface OrderTableContainerProps {
    operation: WhereFilterOp;
    fetchOrders: (operation: WhereFilterOp, direction?: 'next' | 'prev' | 'first', pageSize?: number) => Promise<void>;
    rows: any[];
    totalCount: number;
    columns: GridColDef[];
    isLoading: boolean;
    error: string | null;
}
  
export const OrderTableContainer = ({
    operation,
    fetchOrders,
    rows,
    totalCount,
    columns,
    isLoading,
    error
}: OrderTableContainerProps) => {
    const { paginationModel, handlePageChange } = usePaginationHandler({
      operation: operation,
      onFetchOrders: fetchOrders
    });
  
    useEffect(() => {
      void fetchOrders(operation);
    }, [operation, fetchOrders]);
  
    return (
      <OrderTable
        rowCount={totalCount}
        error={error}
        rows={rows}
        columns={columns}
        isLoading={isLoading}
        paginationModel={paginationModel}
        onPaginationChange={handlePageChange}
      />
    );
};