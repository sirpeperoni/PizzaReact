import { Box, Typography } from '@mui/material';
import type { CartItem } from '../../../cart/types/cart.types';
import { ImageWithDimensionsIndicated } from '../../../../shared/utils/image';


interface OrderItemProps {
    pizza: CartItem;
}

export const OrderItem = ({ pizza }: OrderItemProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "calc(30.33% + 5px)",
                justifyContent: "space-between",
                mb: 1
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    mb: 0.5
                }}
            >
                <img 
                    width={48} 
                    height={48} 
                    src={ImageWithDimensionsIndicated({r: 584, x: 584, id: pizza.image})}
                    alt={pizza.name || 'pizza'}
                    style={{ objectFit: "cover" }}
                />
            </Box>
            <Box>
                <Typography
                    sx={{ 
                        fontSize: 11, 
                        textAlign: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "100%"
                    }}
                >
                    {pizza.name || "Пицца"}
                </Typography>                
                <Typography 
                    component="p" 
                    sx={{ fontSize: 10, color: "text.secondary" }}
                >
                    {pizza.settings?.dough}, {pizza.settings?.size}
                </Typography>
            </Box>
        </Box>
    );
};