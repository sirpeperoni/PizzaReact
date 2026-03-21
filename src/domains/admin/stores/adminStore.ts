import { devtools, persist } from "zustand/middleware";
import type { HistoryOrder } from "../../../shared/types/historyOrder";
import { adminService } from "../services/adminService";
import { create } from "zustand";
import type { OrderStatus } from "../../profile/types/types";
import type { WhereFilterOp } from "firebase/firestore";
import type { GoodItemInterface } from "../../pizza/types/pizza.types";

export interface PizzaAdd {
    title: string,
    img: string,

}


interface AdminStore{
    isLoading: boolean,
    error: string | null,
    progressOrders: HistoryOrder[]
    doneOrders: HistoryOrder[]
    totalDoneOrders: number;
    totalProgressOrders: number;



    fetchProgressOrders: () => Promise<void>;
    fetchDoneOrders: () => Promise<void>;
    getCollectionCount: (col: string, comparison: WhereFilterOp) => Promise<void>;
    updateOrderStatus: (userId: string, docId: string, status: OrderStatus) => Promise<void>;
    addNewGoodToCategory: (category: string, newGood: GoodItemInterface) => Promise<void>;
}
 
export const useAdminStore = create<AdminStore>()(
    devtools(
        persist(
            (set) => {
                const getCollectionCount = async (col: string, comparison: WhereFilterOp) => {
                    try {
                        set({ isLoading: true, error: null });
                        const count = await adminService.getCollectionCount(col, comparison)
                        if(comparison === '==') {
                            set({ isLoading: false, totalDoneOrders: count });
                        } 
                        if(comparison === '!=') {
                            set({ isLoading: false, totalProgressOrders: count });
                        }
                        
                    } catch (err) {
                        const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
                        set({ error: errorMessage, isLoading: false });
                        throw err;
                    }
                }
                const fetchProgressOrders = async () => {
                    try {
                        set({ isLoading: true, error: null });
                        await getCollectionCount('orders', '!=')
                        const orders = await adminService.fetchProgressOrders()

                        set({progressOrders: orders, isLoading: false})
                    } catch (err) {
                        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
                        set({ error: errorMessage, isLoading: false });
                        throw err;
                    }
                }

                return ({
                    isLoading: false,
                    error: null,
                    progressOrders: [],
                    doneOrders:[],
                    totalDoneOrders: 0,
                    totalProgressOrders: 0,
                    fetchProgressOrders,
                    getCollectionCount,
                    updateOrderStatus: async (userId, docId, status) => {
                        try {
                            set({ isLoading: true, error: null });
                            await adminService.updateOrderStatus(userId, docId, status)
                            await fetchProgressOrders()
                            set({ isLoading: false });
                            
                        } catch (err) {
                            const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
                            set({ error: errorMessage, isLoading: false });
                            throw err;
                        }
                    },
                    addNewGoodToCategory: async (category: string, newGood: GoodItemInterface) => {
                        try {
                            set({ isLoading: true, error: null });
                            await adminService.addNewGoodToCategory<GoodItemInterface>(category, newGood)
                            set({ isLoading: false });
                        } catch (err) {
                            const errorMessage = err instanceof Error ? err.message : 'Failed to add new good';
                            set({ error: errorMessage, isLoading: false });
                            throw err;
                        }
                    },
                    fetchDoneOrders: async () => {
                        try {
                            set({ isLoading: true, error: null });
                            await getCollectionCount('orders', '==')
                            const orders = await adminService.fetchDoneOrders()
                            set({doneOrders: orders, isLoading: false})
                        } catch (err) {
                            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
                            set({ error: errorMessage, isLoading: false });
                            throw err;
                        }
                    }
            })
        },
            { name: 'auth-store' },
        ),
        {
            name: 'admin-storage',
        },
    )
)