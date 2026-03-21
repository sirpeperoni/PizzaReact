import { Box } from "@mui/material";
import type { HistoryOrder } from "../../../../shared/types/historyOrder";
import { TableProgressOrders } from "../table/TableProgressOrders";

interface OrderItemProps {
    order: HistoryOrder
}

export const OrderItem = ({ order }: OrderItemProps) => {
    return <p>{order.id}</p>;
};

export const ProgressOrders = () => {    
    return (
        <Box sx={{width: "100%", height:"100%"}}>
            <TableProgressOrders/>
        </Box>
    );
};