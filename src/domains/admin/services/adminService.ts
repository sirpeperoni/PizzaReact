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
} from 'firebase/firestore';
import { db } from '../../../shared/firebase';
import type { HistoryOrder } from '../../../shared/types/historyOrder';
import type { OrderStatus } from '../../profile/types/types';

class AdminService {
  fetchOrders = async (
    operation: WhereFilterOp,
    cursor?: QueryDocumentSnapshot<DocumentData>,
    direction?: 'next' | 'prev',
  ): Promise<{
    orders: HistoryOrder[];
    firstDoc?: QueryDocumentSnapshot<DocumentData>;
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
    totalCount?: number;
  }> => {
    try {
      const baseQuery = [collectionGroup(db, 'orders'), where('status', operation, 'delivered'), orderBy('status')] as const;

      const ordersQuery = direction
        ? direction === 'next'
          ? query(...baseQuery, startAfter(cursor), limit(10))
          : query(...baseQuery, endBefore(cursor), limit(10))
        : query(...baseQuery, limit(10));

      const querySnapshot = await getDocs(ordersQuery);
      const totalCount = await this.getCollectionCount('orders', operation);

      const orders = querySnapshot.docs.map(doc => doc.data() as HistoryOrder);
      const firstDoc = querySnapshot.docs[0];
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      return { orders, firstDoc, lastDoc, totalCount };
    } catch (error) {
      console.error('Error fetch progress orders:', error);
      return { orders: [] };
    }
  };

  // fetchDoneOrders = async (): Promise<HistoryOrder[]> => {
  //   try {
  //     const ordersQuery = query(collectionGroup(db, 'orders'), where('status', '==', 'delivered'), orderBy('status'));
  //
  //     const querySnapshot = await getDocs(ordersQuery);
  //
  //     const newOrders = querySnapshot.docs.map(doc => {
  //       const data = doc.data();
  //       return data as HistoryOrder;
  //     });
  //     return newOrders;
  //   } catch (error) {
  //     console.error('Error fetch progress orders:', error);
  //     return [];
  //   }
  // };

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
