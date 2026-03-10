import type { CartItem } from "../../domains/cart/types/cart.types";

export interface HistoryOrder{
    uid: string,
    items: CartItem[],
    totalPrice: number,
    orderData: number,
    status: "cooking" | "ready" | "in_delivery" | "delivered"
}