import {
  collection,
  collectionGroup,
  doc,
  getCountFromServer,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  limit,
  startAfter,
  endBefore,
  type WhereFilterOp,
  type QueryDocumentSnapshot,
  type DocumentData,
  startAt,
} from 'firebase/firestore';
import { db } from '../../../shared/firebase';
import type { HistoryOrder } from '../../../shared/types/historyOrder';
import type { OrderStatus } from '../../profile/types/types';

class AdminService {
  fetchOrders = async (
    operation: WhereFilterOp,
    currentPageIndex: number,
    cursor?: QueryDocumentSnapshot<DocumentData> | null,
    direction?: 'next' | 'prev' | 'first',
    pageCursors?: QueryDocumentSnapshot<DocumentData>[], 
    pageSize: number = 10
  ): Promise<{
    orders: HistoryOrder[];
    firstDoc?: QueryDocumentSnapshot<DocumentData>;
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
    totalCount?: number;
  }> => {
    try {
      const baseQuery = [collectionGroup(db, 'orders'), where('status', operation, 'delivered'), orderBy('orderDate', 'desc')] as const;

      const getOrdersQuery = () => {
        switch (direction) {
          case 'first':
            return query(...baseQuery, limit(pageSize));
          case 'next':
            return query(...baseQuery, startAfter(cursor), limit(pageSize));
          case 'prev':{
            if (pageCursors && currentPageIndex !== undefined && currentPageIndex > 1) {
              const currentPageFirstDoc = pageCursors[currentPageIndex];
              const previousPageFirstDoc = pageCursors[currentPageIndex - 1];
              return query(...baseQuery, endBefore(currentPageFirstDoc), startAt(previousPageFirstDoc), limit(pageSize));
            }
            return query(...baseQuery, limit(pageSize));
          }
          default:
            return query(...baseQuery, limit(pageSize));
        }
      };
      
      const ordersQuery = getOrdersQuery();

      const querySnapshot = await getDocs(ordersQuery);
      const totalCount = await this.getCollectionCount('orders', operation);

      let orders = querySnapshot.docs.map(doc => doc.data() as HistoryOrder);

      console.log(orders)
      const firstDoc = querySnapshot.docs[0];
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      return { orders, firstDoc, lastDoc, totalCount };
    } catch (error) {
      console.error('Error fetch progress orders:', error);
      return { orders: [] };
    }
  };



  getCollectionCount = async (collectionName: string, comparison: WhereFilterOp) => {
    const ordersQuery = query(collectionGroup(db, collectionName), where('status', comparison, 'delivered'));
    const snapshot = await getCountFromServer(ordersQuery);
    return snapshot.data().count;
  };

  updateOrderStatus = async (userId: string, docId: string, status: OrderStatus): Promise<void> => {
    try {
      const userHistoryOrderRef = doc(db, 'users', userId, 'orders', docId);
      await updateDoc(userHistoryOrderRef, { status: status });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  addNewGoodToCategory = async <T>(category: string, newGood: T): Promise<void> => {
    try {
      const categoryRef = collection(db, category);
      const docId = doc(categoryRef).id;
      const addNewDoc = {
        id: docId,
        ...newGood,
      };
      await setDoc(doc(categoryRef, docId), addNewDoc);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
}

export const adminService = new AdminService();
