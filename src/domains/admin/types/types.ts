export type ChipColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

export const statusConfig = {
    cooking: { 
        label: 'Готовится', 
        color: 'warning',
        nextStatus: 'ready' 
    },
    ready: { 
        label: 'Готов', 
        color: 'info',
        nextStatus: 'in_delivery' 
    },
    in_delivery: { 
        label: 'В доставке', 
        color: 'primary',
        nextStatus: 'delivered' 
    },
    delivered: { 
        label: 'Доставлен', 
        color: 'success',
        nextStatus: null 
    },
};

export type OrderStatus = keyof typeof statusConfig;

export interface OrderStats {
    total: number;
    cooking: number;
    ready: number;
    in_delivery: number;
    delivered: number;
}