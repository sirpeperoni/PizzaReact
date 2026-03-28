import { useState } from 'react';
import type { GridPaginationModel } from '@mui/x-data-grid';
import type { WhereFilterOp } from 'firebase/firestore';

interface UsePaginationHandlerProps {
    operation: WhereFilterOp,
    onFetchOrders: (operation: WhereFilterOp, direction?: 'next' | 'prev' | 'first', pageSize?: number) => Promise<void>;
  }
  
  export const usePaginationHandler = ({ 
    operation, 
    onFetchOrders 
  }: UsePaginationHandlerProps) => {
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
      page: 0,
      pageSize: 10
    });
  
    const handlePageChange = (newPaginationModel: GridPaginationModel) => {
      if (newPaginationModel.page !== paginationModel.page) {
        const direction = newPaginationModel.page > paginationModel.page ? 'next' : 'prev';
        setPaginationModel(newPaginationModel);
        void onFetchOrders(operation, direction, newPaginationModel.pageSize);
      } else if (newPaginationModel.pageSize !== paginationModel.pageSize) {
        setPaginationModel({ ...newPaginationModel, page: 0 });
        void onFetchOrders(operation, 'first', newPaginationModel.pageSize);
      }
    };
  
    return {
      paginationModel,
      handlePageChange
    };
  };