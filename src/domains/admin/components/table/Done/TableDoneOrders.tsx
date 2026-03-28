import { useDoneOrdersColumns } from '../../../hooks/useDoneOrdersColumns';
import { useAdminStore } from '../../../stores/adminStore';
import { OrderTableContainer } from '../OrderTableContainer';


export const TableDoneOrders = () => {
  const isLoading = useAdminStore(state => state.isLoading);
  const orders = useAdminStore(state => state.doneOrders);
  const error = useAdminStore(state => state.error);
  const totalDoneOrders = useAdminStore(state => state.totalDoneOrders);
  const fetchOrders = useAdminStore(state => state.fetchOrders);
  const columns = useDoneOrdersColumns();

  return (
    <OrderTableContainer
      operation="=="
      fetchOrders={fetchOrders}
      rows={orders}
      totalCount={totalDoneOrders}
      columns={columns}
      isLoading={isLoading}
      error={error}
    />
  );
};