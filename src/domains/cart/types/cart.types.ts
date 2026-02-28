export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    totalPrice: number;
    image?: string;
    settings?: Pizza;
    pizzaId?: string;
}

export interface CartState {
    items: CartItem[];
    totalQuantity: number;
    totalAmount: number;
    isLoading: boolean;
    error: string | null;
    settings?: Pizza
}

export interface Pizza {
    size?: string
    dough?: string 
}

export interface UpdateQuantityPayload {
    id: string | number;
    quantity: number;
    settings: Pizza 
}
