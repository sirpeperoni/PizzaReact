import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { CartItem, GoodItemInterface } from "../types/pizza.types";
import { pizzaService } from "../services/pizzaService";
import { cartService } from "../../cart/services/cartService";

interface PizzaStore {
    goods: GoodItemInterface[];
    loading: boolean;
    error: string | null;
    fetchGoods: (collectionName: string) => Promise<GoodItemInterface[]>;
    placeAnOrder: (cartItems: CartItem[], totalPrice: number) => Promise<void>;
}

export const usePizzaStore = create<PizzaStore>()(
    devtools(
        persist(
            (set) => ({
                goods: [],
                loading: false,
                error: null,

                fetchGoods: async (collectionName: string) => {
                    set({ loading: true, error: null });
                    try {
                        const goodsData = await pizzaService.fetchGoods(collectionName);
                        set({ goods: goodsData, loading: false });
                        return goodsData;
                    } catch (err) {
                        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch goods';
                        set({ error: errorMessage, loading: false });
                        throw err;
                    }
                },

                placeAnOrder: async (cartItems: CartItem[], totalPrice: number) => {
                    set({ loading: true, error: null });
                    try {
                        const userId = cartService.userId;
                        if (userId) {
                            await pizzaService.placeAnOrder(userId, cartItems, totalPrice);
                        }
                        set({ loading: false });
                    } catch (err) {
                        const errorMessage = err instanceof Error ? err.message : 'Failed to place order';
                        set({ error: errorMessage, loading: false });
                        throw err;
                    }
                }
            }),
            {
                name: 'pizza-storage'
            }
        ),
        { 
            name: 'PizzaStore',
        }
    )
);

export const usePizza = usePizzaStore;