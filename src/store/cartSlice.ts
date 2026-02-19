import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    totalPrice: number;
    image?: string;
    settings?: Pizza;
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
  
export interface AddToCartPayload {
    id: string;
    name: string;
    price: number;
    quantity?: number;
    image?: string;
    settings?: Pizza
}
  
export interface UpdateQuantityPayload {
    id: string | number;
    quantity: number;
}


const initialState: CartState  = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    isLoading: false,
    error: null,
    settings: {}
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);
            
            if (existingItem) {
                existingItem.quantity += newItem.quantity || 1;
                existingItem.totalPrice = existingItem.price * existingItem.quantity;
            } else {
                state.items.push({
                    ...newItem,
                    quantity: newItem.quantity || 1,
                    totalPrice: newItem.price * (newItem.quantity || 1)
                });
            }
            
            cartSlice.caseReducers.calculateTotals(state);
        },
        
        removeFromCart: (state, action: PayloadAction<string | number>) => {
            const id = action.payload;
            state.items = state.items.filter(item => item.id !== id);
            cartSlice.caseReducers.calculateTotals(state);
        },
        
        updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            
            if (item) {
                item.quantity = quantity;
                item.totalPrice = item.price * quantity;
            }
            
            cartSlice.caseReducers.calculateTotals(state);
        },
        
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },
        
        calculateTotals: (state) => {
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
        },
        
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    setLoading,
    setError 
} = cartSlice.actions;
  
export default cartSlice.reducer;