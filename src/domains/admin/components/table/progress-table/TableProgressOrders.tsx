// TableProgressOrders.tsx
import { useState } from 'react';
import { useAdminStore } from '../../../stores/adminStore.ts';
import type { OrderStatus } from '../../../types/types.ts';
import { useOrderColumns } from '../../../hooks/useOrderColumns.tsx';
import { OrderTableContainer } from '../OrderTableContainer.tsx';


export const TableProgressOrders = () => {
  const isLoading = useAdminStore(state => state.isLoading);
  const progressOrders = useAdminStore(state => state.progressOrders);
  const error = useAdminStore(state => state.error);
  const totalProgressOrders = useAdminStore(state => state.totalProgressOrders);
  const updateOrderStatus = useAdminStore(state => state.updateOrderStatus);
  const fetchOrders = useAdminStore(state => state.fetchOrders);
  
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleStatusChange = async (userId: string, orderId: string | undefined, newStatus: OrderStatus) => {
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

  const columns = useOrderColumns(updatingOrderId, handleStatusChange);

  return (
    <OrderTableContainer
      operation="!="
      fetchOrders={fetchOrders}
      rows={progressOrders}
      totalCount={totalProgressOrders}
      columns={columns}
      isLoading={isLoading}
      error={error}
    />
  );
};