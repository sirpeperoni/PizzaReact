import { Box, Typography } from "@mui/material"
import type { HistoryOrder } from "../../../../shared/types/historyOrder"
import { OrderCard } from "../order-card/OrderCard"

interface CompletedOrdersProps {
    completedOrders: HistoryOrder[]
}


export const CompletedOrders = ({completedOrders}: CompletedOrdersProps) => {
    return <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "medium" }}>
            История заказов ({completedOrders.length})
        </Typography>
        <Box sx={{ 
            display: "flex", 
            gap: 3, 
            flexWrap: "wrap",
        }}>
            {completedOrders.map((order) => (
                <OrderCard  order={order} key={order.orderData}/>
            ))}
        </Box>
    </Box>
}