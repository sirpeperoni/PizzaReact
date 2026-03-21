import { Typography, Divider, Box } from '@mui/material';
import { formatDate } from '../../../../../shared/utils/numberToDate';


interface OrderHeaderProps {
    date: number;
    itemsCount: number;
}

const getItemWord = (count: number): string => {
    if (count === 1) return 'товар';
    if (count >= 2 && count <= 4) return 'товара';
    return 'товаров';
};

export const OrderHeader = ({ date, itemsCount }: OrderHeaderProps) => {
    return (
        <>
            <Typography 
                sx={{ 
                    fontSize: 18, 
                    fontWeight: "bold",
                    mb: 1 
                }}
            >
                {formatDate(date)}
            </Typography>
            
            <Divider sx={{ mb: 1.5 }} />
            
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                    Заказ
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: "medium" }}>
                    {itemsCount} {getItemWord(itemsCount)}
                </Typography>
            </Box>
        </>
    );
};