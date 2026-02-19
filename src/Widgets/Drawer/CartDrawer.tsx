import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ImageWithDimensionsIndicated } from "../../utils/image";
import { clearCart, removeFromCart } from "../../store/cartSlice";
import { goodsApi } from "../../api/goodsApi";

interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
}


export const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
    const cartState = useSelector((state: RootState) => state.cart);
    const authState = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const onPlaceAnOrder = () => {
        goodsApi.placeAnOrder(authState.user?.uid!, cartState.items, cartState.totalAmount, )
        dispatch(clearCart())
        onClose()
    }
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 400 },
                    p: 2
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                Корзина
            </Typography>
            <IconButton onClick={onClose} size="small">
                <CloseIcon />
            </IconButton>
            </Box>
    
            <Divider />

            {cartState.items.length === 0 ? (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '60vh',
                    gap: 2
                }}>
                    <Typography variant="body1">
                        Корзина пуста
                    </Typography>
                </Box>
            ) : (
                <>
                    <List sx={{ flex: 1, overflow: 'auto', py: 2 }}>
                        {cartState.items.map((item, index) => (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <IconButton edge="end" size="small" onClick={() => {
                                        dispatch(removeFromCart(item.id))
                                    }}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                }
                                sx={{ 
                                    mb: 1,
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    display: "flex",
                                    gap: 2
                                }}
                            >
                                <ListItemIcon>
                                    <img width={64} height={64} src={ImageWithDimensionsIndicated({r: 292, x: 292, id: item.image!})} alt="" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                            {item.name}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box >
                                            <Box sx={{display: "flex", gap: 1}}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                                    {`${item.settings?.size},`}
                                                </Typography>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                                    {item.settings?.dough === "tradition" ? "традиционное тесто" : "тонкое тесто"}
                                                </Typography>
                                            </Box>
                                            <Box component="span" sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                                                <Typography variant="body2">
                                                    Кол-во: {item.quantity}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {item.price * item.quantity} ₽
                                                </Typography>
                                            </Box>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
        
                    <Divider />

                    <Paper elevation={0} sx={{ p: 2, mt: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Итого:</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {cartState.totalAmount} ₽
                        </Typography>
                    </Box>
                    
                    <Button 
                        variant="contained" 
                        fullWidth
                        color="warning"
                        sx={{borderRadius: 15}}
                        size="large"
                        onClick={onPlaceAnOrder}
                    >
                        Оформить заказ
                    </Button>
                    </Paper>
                </>
            )}
        </Drawer>
    );
};