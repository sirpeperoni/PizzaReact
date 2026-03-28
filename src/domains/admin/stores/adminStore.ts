import { devtools, persist } from 'zustand/middleware';
import type { HistoryOrder } from '../../../shared/types/historyOrder';
import { adminService } from '../services/adminService';
import { create } from 'zustand';
import type { OrderStatus } from '../../profile/types/types';
import type { DocumentData, QueryDocumentSnapshot, WhereFilterOp } from 'firebase/firestore';
import type { GoodItemInterface } from '../../pizza/types/pizza.types';

export interface PizzaAdd {
  title: string;
  img: string;
}

interface AdminStore {
  isLoading: boolean;
  error: string | null;
  progressOrders: HistoryOrder[];
  doneOrders: HistoryOrder[];
  totalDoneOrders: number;
  totalProgressOrders: number;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
  firstDoc?: QueryDocumentSnapshot<DocumentData>;
  pageCursors: QueryDocumentSnapshot[]; // firstDoc каждой страницы
  currentPageIndex: number;

  fetchOrders: (operation: WhereFilterOp, direction?: 'next' | 'prev' | 'first', pageSize?: number) => Promise<void>;
  getCollectionCount: (col: string, comparison: WhereFilterOp) => Promise<void>;
  updateOrderStatus: (userId: string, docId: string, status: OrderStatus) => Promise<void>;
  addNewGoodToCategory: (category: string, newGood: GoodItemInterface) => Promise<void>;
  resetDocs: () => void;
}

export const useAdminStore = create<AdminStore>()(
  devtools(
    persist(
      (set, get) => {
        const getCollectionCount = async (col: string, comparison: WhereFilterOp) => {
          try {
            set({ isLoading: true, error: null });
            const count = await adminService.getCollectionCount(col, comparison);
            if (comparison === '==') {
              set({ totalDoneOrders: count });
            }
            if (comparison === '!=') {
              set({ totalProgressOrders: count });
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
            set({ error: errorMessage, isLoading: false });
            throw err;
          }
        };
        const fetchOrders = async (operation: WhereFilterOp, direction?: 'next' | 'prev' | 'first', pageSize?: number) => {
          try {
            set({ isLoading: true, error: null });
            
            let cursor = null;
            let newPageCursors = [...get().pageCursors];
            let newCurrentPageIndex = get().currentPageIndex;
            
            if (direction === 'next') {
              cursor = get().lastDoc;
              newCurrentPageIndex = get().currentPageIndex + 1;
            } else if (direction === 'prev') {
              newCurrentPageIndex = get().currentPageIndex - 1;

              cursor = get().pageCursors[newCurrentPageIndex];
            } else if (direction === 'first') {
              newCurrentPageIndex = 0;
              newPageCursors = [];
              cursor = null;
            }
            
            const { orders, lastDoc, firstDoc, totalCount } = await adminService.fetchOrders(
              operation,
              get().currentPageIndex,
              cursor,
              direction,
              get().pageCursors,
              pageSize,
            );

            if (direction === 'next' && firstDoc) {
              newPageCursors[newCurrentPageIndex] = firstDoc;
            }
            if(operation === '!=') {
              set({ 
                progressOrders: orders, 
                isLoading: false, 
                lastDoc, 
                firstDoc, 
                totalProgressOrders: totalCount,
                pageCursors: newPageCursors,
                currentPageIndex: newCurrentPageIndex
              });
            }

            if(operation === '==') {
              set({ 
                doneOrders: orders, 
                isLoading: false, 
                lastDoc, 
                firstDoc, 
                totalDoneOrders: totalCount,
                pageCursors: newPageCursors,
                currentPageIndex: newCurrentPageIndex
              });
            }
            
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
            set({ error: errorMessage, isLoading: false });
            throw err;
          }
        };

        const resetDocs = () => {
          set({
            lastDoc: undefined,
            firstDoc: undefined,
          });
        }

        return {
          isLoading: false,
          error: null,
          progressOrders: [],
          doneOrders: [],
          totalDoneOrders: 0,
          totalProgressOrders: 0,
          fetchOrders,
          getCollectionCount,
          resetDocs,
          pageCursors: [],
          currentPageIndex: 0,
          updateOrderStatus: async (userId, docId, status) => {
            try {
              set({ isLoading: true, error: null });
              await adminService.updateOrderStatus(userId, docId, status);
              await fetchOrders('!=');
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
              await adminService.addNewGoodToCategory<GoodItemInterface>(category, newGood);
              set({ isLoading: false });
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Failed to add new good';
              set({ error: errorMessage, isLoading: false });
              throw err;
            }
          }
        };
      },
      { name: 'auth-store' },
    ),
    {
      name: 'admin-storage',
    },
  ),
);
