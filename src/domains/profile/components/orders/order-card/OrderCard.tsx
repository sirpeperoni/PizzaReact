import { Paper } from '@mui/material';
import type { HistoryOrder } from '../../../../../shared/types/historyOrder';
import { OrderHeader } from '../order-header/OrderHeader';
import { OrderItemsList } from '../order-items-list/OrderItemsList';
import { OrderTotal } from '../order-total/OrderTotal';
import { OrderStatus } from '../order-status/OrderStatus';
interface OrderCardProps {
    order: HistoryOrder,
}

export const OrderCard = ({ order }: OrderCardProps) => {
    return (
        <Paper 
            elevation={2}
            sx={{
                width: 400,
                height: 400,
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6
                }
            }}
        >
            <OrderHeader date={order.orderDate} itemsCount={order.items.length} />
            <OrderItemsList items={order.items} />
            <OrderTotal totalPrice={order.totalPrice} />
            <OrderStatus status={order.status} />
        </Paper>
    );
};