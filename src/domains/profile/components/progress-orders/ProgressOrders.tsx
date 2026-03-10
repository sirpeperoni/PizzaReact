import { Box, Typography } from "@mui/material"
import type { HistoryOrder } from "../../../../shared/types/historyOrder"
import { OrderCard } from "../order-card/OrderCard"

interface ProgressOrdersProps {
    inProgressOrders: HistoryOrder[]
}


export const ProgressOrders = ({inProgressOrders}: ProgressOrdersProps) => {
    return  (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: "medium" }}>
                В процессе: ({inProgressOrders.length})
            </Typography>
            <Box sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                flexWrap: "wrap",
                gap: "20px"
            }}>
                {inProgressOrders.map((order: HistoryOrder) => (
                    <OrderCard order={order} key={order.orderData}/>
                ))}
            </Box>
        </Box>
    )
}