import { useState, useCallback } from "react";
import type { CartItem, GoodItemInterface } from "../types/pizza.types";
import { pizzaService } from "../services/pizzaService";


export const usePizza = () => {
    const [goods, setGoods] = useState<GoodItemInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGoods = useCallback(async (collectionName: string) => {
        setLoading(true);
        setError(null);
        try {
            const goodsData = await pizzaService.fetchGoods(collectionName);
            setGoods(goodsData);
            return goodsData;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch goods');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const placeAnOrder = useCallback(async (userId: string, cartItems: CartItem[], totalPrice: number) => {
        setLoading(true);
        setError(null);
        try {
            await pizzaService.placeAnOrder(userId, cartItems, totalPrice);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to place order');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        goods,
        loading,
        error,
        fetchGoods,
        placeAnOrder
    };
};