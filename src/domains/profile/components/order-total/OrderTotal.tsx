import { Box, Typography, Divider } from '@mui/material';

interface OrderTotalProps {
    totalPrice: number;
}

export const OrderTotal = ({ totalPrice }: OrderTotalProps) => {
    return (
        <>
            <Divider />
            <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1, mt: 1 }}
            >
                <Typography>Сумма:</Typography>
                <Typography>{totalPrice} ₽</Typography>
            </Box>
        </>
    );
};