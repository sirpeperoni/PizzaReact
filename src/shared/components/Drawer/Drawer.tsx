import { Alert, Box, Button, CircularProgress, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useCartStore } from "../../../domains/cart/stores/cartStore";
import { ImageWithDimensionsIndicated } from "../../utils/image";
import { useAuthStore } from "../../../domains/auth/stores/authStore";
import { useEffect } from "react";
import type { Pizza } from "../../../domains/cart/types/cart.types";
import { Add,  Remove } from "@mui/icons-material";
import {  usePizzaStore } from "../../../domains/pizza/stores/usePizzaStore";


interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
}


export const CartDrawer = ({ open, onClose }: CartDrawerProps) => {

    const items = useCartStore((state) => state.items);
    const totalAmount = useCartStore((state) => state.totalAmount);
    const isLoading = useCartStore((state) => state.isLoading);
    const error = useCartStore((state) => state.error);
    const user = useAuthStore((state) => state.user);
    const itmes = useCartStore((state) => state.items)
    const pizza = usePizzaStore()
    
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const clearCart = useCartStore((state) => state.clearCart);
    const loadUserCart = useCartStore((state) => state.loadUserCart);
    
    const onPlaceAnOrder = async () => {
        try {
            if(user?.uid){
                await pizza.placeAnOrder(itmes, totalAmount)
                clearCart()
            }
        } catch (error) {
            
        }
    }

    const handleClearCart = () => {
        try {
            if(user?.uid){
                clearCart()
            }
        } catch (error) {
            
        }
    }

    const handleUpdateQuantity = async (itemId: string, newQuantity: number, settings: Pizza) => {
        if (newQuantity < 1) return;
        try {
            await updateQuantity({
                id: itemId,
                quantity: newQuantity,
                settings
            });
        } catch (error) {

        }
    };

    useEffect(() => {
        if (open && user?.uid) {
            loadUserCart();
        }
    }, [open, user?.uid, loadUserCart]);
    

    const handleRefreshCart = async () => {
        if (!user?.uid) return;
        
        try {
            await loadUserCart();
        } catch (error) {

        }
    };

    const handleRemoveItem = async (itemId: string, settings?: { size?: string; dough?: string }) => {
        try {
            await removeFromCart(itemId, settings);
        } catch (error) {

        }
    };
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
                <Box sx={{display: "flex"}}>
                    {user && items.length > 0 && (
                        <Box sx={{display: "flex"}}>
                            <IconButton onClick={handleRefreshCart} size="small" sx={{ mr: 1 }} disabled={isLoading}>
                                <Typography variant="caption" sx={{ mr: 0.5 }}>Обновить</Typography>
                            </IconButton>
                            <IconButton onClick={handleClearCart} size="small" sx={{ mr: 1 }} disabled={isLoading}>
                                <Typography variant="caption" sx={{ mr: 0.5 }}>Очисить корзину</Typography>
                            </IconButton>
                        </Box>
                    )}
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>
    
            <Divider />

            {isLoading && items.length === 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }} onClose={handleRefreshCart}>
                    {error}
                    {user && (
                        <Button color="inherit" size="small" onClick={handleRefreshCart} sx={{ ml: 2 }}>
                            Повторить
                        </Button>
                    )}
                </Alert>
            )}

            {!isLoading && items.length === 0 ? (
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
                    {user && (
                        <Button variant="outlined" onClick={handleRefreshCart} size="small">
                            Обновить
                        </Button>
                    )}
                    {!user && (
                        <Typography variant="body2" color="text.secondary">
                            Войдите, чтобы увидеть сохраненные товары
                        </Typography>
                    )}
                </Box>
            ) : (
                <>
                    <List sx={{ flex: 1, overflow: 'auto', py: 2 }}>
                        {items.map((item, index) => {
                            const itemKey = `${item.id}-${item.settings?.size || 'default'}-${item.settings?.dough || 'default'}-${index}`;
                            return (
                                    <ListItem
                                        key={itemKey}
                                        secondaryAction={
                                            <IconButton edge="end" disabled={isLoading} size="small" onClick={() => {
                                                handleRemoveItem(item.id, item.settings)
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
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.settings!)}
                                                        disabled={item.quantity <= 1 || isLoading}
                                                        sx={{ border: '1px solid', borderColor: 'divider' }}
                                                    >
                                                        <Remove fontSize="small" />
                                                    </IconButton>
                                                    
                                                    <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'center' }}>
                                                        {item.quantity}
                                                    </Typography>
                                                    
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.settings!)}
                                                        disabled={isLoading}
                                                        sx={{ border: '1px solid', borderColor: 'divider' }}
                                                    >
                                                        <Add fontSize="small" />
                                                    </IconButton>
                                                    
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 'auto' }}>
                                                        {item.totalPrice || item.price * item.quantity} ₽
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                    
                                </ListItem>
                            )
                        })}
                    </List>
        
                    <Divider />

                    <Paper elevation={0} sx={{ p: 2, mt: 'auto' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Итого:</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {totalAmount} ₽
                            </Typography>
                        </Box>
                        <Button 
                            variant="contained" 
                            fullWidth
                            color="warning"
                            sx={{borderRadius: 15}}
                            size="large"
                            onClick={onPlaceAnOrder}
                            disabled={pizza.loading || isLoading}
                        >
                            {
                                pizza.loading || isLoading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Оформить заказ'
                                )
                            }  
                        </Button>
                    </Paper>
                </>
            )}
        </Drawer>
    );
};