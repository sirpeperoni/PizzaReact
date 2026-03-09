import { create } from 'zustand';
import type { CartItem, CartState, Pizza, UpdateQuantityPayload } from '../types/cart.types';
import { combine, devtools, persist } from 'zustand/middleware';
import { cartService } from '../services/cartService';
import { firestoreService } from '../../../shared/services/firestoreService';

interface CartStore extends CartState {
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string, settings?: Pizza) => Promise<void>;
  updateQuantity: (update: UpdateQuantityPayload) => Promise<void>;
  clearCart: () => Promise<void>;
  loadUserCart: () => Promise<void>;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  isLoading: false,
  error: null,
  settings: {},
};

const calculateTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((total, item) => total + (item.quantity || 0), 0);
  const totalAmount = items.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  return { totalQuantity, totalAmount };
};

const createItemMatcher = (id: string, settings?: Pizza) => (item: CartItem) =>
  settings ? item.id === id && item.settings?.size === settings.size && item.settings?.dough === settings.dough : item.id === id;

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
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to load cart',
              isLoading: false,
            });
          }
        };

        return {
          loadUserCart,
          addToCart: async newItem => {
            set({ isLoading: true });
            await cartService.addToCart(newItem);
            set({ isLoading: false });
            void loadUserCart();
          },

          removeFromCart: async (id, settings) => {
            const { items } = get();
            const uid = firestoreService.userId;

            if (!uid) return;
            set({ isLoading: true, error: null });

            try {
              const matcher = createItemMatcher(id, settings);
              const itemToRemove = items.find(matcher);
              if (itemToRemove?.id) {
                await cartService.removeFromCart(itemToRemove, uid);
                await loadUserCart();
              }
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Failed to remove item from cart',
                isLoading: false,
              });
            }
          },

          updateQuantity: async updateData => {
            const { id, quantity, settings } = updateData;
            const { items } = get();
            const uid = firestoreService.userId;
            if (!uid) return;

            set({ isLoading: true, error: null });
            try {
              const matcher = createItemMatcher(id, settings);
              const itemToUpdate = items.find(matcher);
              if (itemToUpdate?.id) {
                await cartService.updateCartItemQuantity(itemToUpdate.id, uid, quantity);
                await loadUserCart();
              }
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Failed to update quantity',
                isLoading: false,
              });
            }
          },

          clearCart: async () => {
            const uid = firestoreService.userId;
            if (!uid) return;

            set({ isLoading: true, error: null });
            try {
              await cartService.clearCart(uid);
              set({
                items: [],
                totalQuantity: 0,
                totalAmount: 0,
                error: null,
                isLoading: false,
              });
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Failed to clear cart',
                isLoading: false,
              });
            }
          },
        };
      }),
      { name: 'cart-store' },
    ),
    {
      name: 'cart-storage',
    },
  ),
);
