import { create } from "zustand";
import type { CartItem, CartState, UpdateQuantityPayload } from "../types/cart.types";
import { combine, devtools, persist } from "zustand/middleware";
import { cartService } from "../services/cartService";
import { useAuthStore } from "../../auth/stores/authStore";

interface CartStore extends CartState {
    addToCart: (item: CartItem) => Promise<void>,
    removeFromCart: (id: string, settings?: { size?: string; dough?: string }) => Promise<void>,
    updateQuantity: (update: UpdateQuantityPayload) => Promise<void>,
    clearCart: (uid: string) => Promise<void>,
    loadUserCart: () => Promise<void>
}

const initialState: CartState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    isLoading: false,
    error: null,
    settings: {}
};

const calculateTotals = (items: CartItem[]) => {
    const totalQuantity = items.reduce(
        (total, item) => total + (item.quantity || 0),
        0
    );
    const totalAmount = items.reduce(
        (total, item) => total + (item.price * (item.quantity || 1)),
        0
    );
    return { totalQuantity, totalAmount };
};

const findItemIndex = (items: CartItem[], id: string, settings?: { size?: string; dough?: string }) => {
    return items.findIndex(item =>
        item.id === id &&
        item.settings?.size === settings?.size &&
        item.settings?.dough === settings?.dough
    );
};

export const useCartStore = create<CartStore>()(
    persist(
        devtools(
            combine(initialState, (set, get) => {
                const loadUserCart = async () => {
                    try {
                        set({ isLoading: true, error: null });
                        const cartItems = await cartService.getUserCart();
                        const totals = calculateTotals(cartItems);
                        set({
                            items: cartItems,
                            ...totals,
                            isLoading: false
                        });
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : 'Failed to load cart',
                            isLoading: false
                        });
                    }
                }

                return {
                    loadUserCart,
                    addToCart: async (newItem) => {
                        set({ isLoading: true });
                        await cartService.addToCart(newItem);
                        set({ isLoading: false});
                        void loadUserCart();
                    },

                    removeFromCart: async (id, settings) => {
                        const { items } = get();
                        const uid = useAuthStore.getState().user?.uid;
                        
                        if (!uid) return;

                        set({ isLoading: true, error: null });
                        try {
                            const itemToRemove = items.find(item => {
                                if (settings) {
                                    return item.id === id && 
                                           item.settings?.size === settings.size && 
                                           item.settings?.dough === settings.dough;
                                }
                                return item.id === id;
                            });

                            if (itemToRemove?.id) {
                                await cartService.removeFromCart(itemToRemove, uid);
                            }
                            
                            const filteredItems = items.filter((item) => {
                                if (settings) {
                                    return !(item.id === id && 
                                           item.settings?.size === settings.size && 
                                           item.settings?.dough === settings.dough);
                                }
                                return item.id !== id;
                            });
                            
                            const totals = calculateTotals(filteredItems);
                            
                            set({ 
                                items: filteredItems,
                                ...totals,
                                isLoading: false 
                            });
                        } catch (error) {
                            set({ 
                                error: error instanceof Error ? error.message : 'Failed to remove item from cart',
                                isLoading: false 
                            });
                        }
                    },

                    updateQuantity: async (update) => {
                        const { id, quantity, settings } = update;
                        const { items } = get();
                        const uid = useAuthStore.getState().user?.uid;
                        if (!uid) return;

                        set({ isLoading: true, error: null });
                        try {
                            const itemToUpdate = items.find(item => {
                                const isMatchingItem = settings 
                                    ? item.id === id && 
                                      item.settings?.size === settings.size && 
                                      item.settings?.dough === settings.dough
                                    : item.id === id;
                                return isMatchingItem;
                            });

                            if (itemToUpdate?.id) {
                                await cartService.updateCartItemQuantity(itemToUpdate.id, uid, quantity);
                            }

                            const updatedItems = items.map((item) => {
                                const isMatchingItem = settings 
                                    ? item.id === id && 
                                      item.settings?.size === settings.size && 
                                      item.settings?.dough === settings.dough
                                    : item.id === id;
                                
                                if (isMatchingItem) {
                                    return {
                                        ...item,
                                        quantity,
                                        totalPrice: item.price * quantity,
                                    };
                                }
                                return item;
                            });

                            const totals = calculateTotals(updatedItems);

                            set({ 
                                items: updatedItems,
                                ...totals,
                                isLoading: false 
                            });
                        } catch (error) {
                            set({ 
                                error: error instanceof Error ? error.message : 'Failed to update quantity',
                                isLoading: false 
                            });
                        }
                    },

                    clearCart: async (uid) => {
                        if (!uid) return;

                        set({ isLoading: true, error: null });
                        try {
                            await cartService.clearCart(uid);
                            set({ 
                                items: [],
                                totalQuantity: 0,
                                totalAmount: 0,
                                error: null,
                                isLoading: false 
                            });
                        } catch (error) {
                            set({ 
                                error: error instanceof Error ? error.message : 'Failed to clear cart',
                                isLoading: false 
                            });
                        }
                    }
                }
            }),
            { name: 'cart-store' }
        ),
        {
            name: 'cart-storage'
        }
    )
)
