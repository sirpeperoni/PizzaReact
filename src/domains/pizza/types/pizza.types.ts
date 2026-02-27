export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    totalPrice: number;
    image?: string;
    settings?: Pizza;
}

export interface Pizza {
    size?: string
    dough?: string 
}

export interface GoodItemInterface {
    id: string;
    title: string;
    content: string;
    price: number[];
    sizes: string[];
    dough: string[];
    img: string;
}