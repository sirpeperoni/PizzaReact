import { create } from "zustand";
import type { CartItem, CartState, UpdateQuantityPayload } from "../types/cart.types";
import { combine, devtools, persist } from "zustand/middleware";
import { cartService } from "../services/cartService";
import { useAuthStore } from "../../auth/stores/authStore";

interface CartStore extends CartState {
    addToCart: (item: CartItem, uid: string | undefined) => Promise<void>,
    removeFromCart: (id: string, settings?: { size?: string; dough?: string }) => Promise<void>,
    updateQuantity: (update: UpdateQuantityPayload) => Promise<void>,
    clearCart: (uid: string) => Promise<void>,
    loadUserCart: (uid: string) => Promise<void>
}

const initialState: CartState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    isLoading: false,
    error: null,
    settings: {}
};

export const useCartStore = create<CartStore>()(
    persist(
        devtools(
            combine(initialState, (set, get) => {
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
                return {
                    loadUserCart: async (uid) => {
                        if (!uid) return;
                        
                        set({ isLoading: true, error: null });
                        try {
                            const cartItems = await cartService.getUserCart(uid);
                            console.log(cartItems)
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
                    },
                    addToCart: async (newItem, uid) => {
                        if (!uid) return;
                    
                        set({ isLoading: true, error: null });

                        const currentState = get();
                        const originalItems = [...currentState.items];
                        const quantity = newItem.quantity || 1;

                        const existingItemIndex = findItemIndex(originalItems, newItem.id, newItem.settings);

                        let optimisticItems: CartItem[] = [];
                        let isUpdate = false;
                    
                        try {
                            if (existingItemIndex !== -1) {
                                const existingItem = originalItems[existingItemIndex];
                                if (!existingItem) {
                                    throw new Error('Existing item not found');
                                }
                                
                                const newQuantity = existingItem.quantity + quantity;
                                
                                optimisticItems = originalItems.map((item, index) => {
                                    if (index === existingItemIndex) {
                                        return {
                                            ...item,
                                            quantity: newQuantity,
                                            totalPrice: item.price * newQuantity,
                                        };
                                    }
                                    return item;
                                });
                                isUpdate = true;
                            } else {
                                const newCartItem: CartItem = {
                                    ...newItem,
                                    quantity,
                                    totalPrice: newItem.price * quantity,
                                };
                                optimisticItems = [...originalItems, newCartItem];
                                isUpdate = false;
                            }

                            const optimisticTotals = calculateTotals(optimisticItems);

                            set({ 
                                items: optimisticItems,
                                ...optimisticTotals,
                                isLoading: true, 
                                error: null 
                            });

                            if (isUpdate) {
                                const existingItem = originalItems[existingItemIndex];
                                const newQuantity = existingItem.quantity + quantity;
                                
                                if (existingItem.id) {
                                    await cartService.updateCartItemQuantity(existingItem.id, uid, newQuantity);
                                }

                                set({ isLoading: false });
                            } else {
                                const newCartItem: CartItem = {
                                    ...newItem,
                                    quantity,
                                    totalPrice: newItem.price * quantity,
                                };

                                const addedItem = await cartService.addToCart(newCartItem, uid);

                                const finalItems = optimisticItems.map(item => {
                                    if (!item.id && 
                                        item.id === newItem.id && 
                                        JSON.stringify(item.settings) === JSON.stringify(newItem.settings)) {
                                        return addedItem;
                                    }
                                    return item;
                                });
                                
                                const finalTotals = calculateTotals(finalItems as CartItem[]);
                                
                                set({ 
                                    items: finalItems as CartItem[],
                                    ...finalTotals,
                                    isLoading: false 
                                });
                            }
                        } catch (error) {
                            console.error('Error in addToCart:', error);
                            set({ 
                                items: originalItems,
                                ...calculateTotals(originalItems),
                                error: error instanceof Error ? error.message : 'Failed to add item to cart',
                                isLoading: false 
                            });
                        }
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