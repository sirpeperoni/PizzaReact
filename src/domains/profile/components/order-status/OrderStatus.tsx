import { Box, Typography, Divider } from '@mui/material';
import type { OrderStatus as OrderStatusType } from '../../types/types';

interface OrderStatusProps {
    status: OrderStatusType;
}

const getStatusText = (status: OrderStatusType): string => {
    const statusMap = {
        'ready': '✓ Приготовлено, ждём курьера!',
        'cooking': '🕒 В процессе',
        'in_delivery': '🚴 Доставляется',
        'delivered': '✓ Доставлено'
    };
    return statusMap[status] || status;
};

const getStatusColor = (status: OrderStatusType): string => {
    return status === 'delivered' ? 'success.main' : 'warning.main';
};

export const OrderStatus = ({ status }: OrderStatusProps) => {
    return (
        <Box sx={{ mt: "auto" }}>
            <Divider sx={{ mb: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography 
                    sx={{ 
                        fontSize: 13,
                        color: getStatusColor(status),
                        fontWeight: "medium"
                    }}
                >
                    {getStatusText(status)}
                </Typography>
            </Box>
        </Box>
    );
};