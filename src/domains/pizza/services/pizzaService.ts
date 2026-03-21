import { addDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import type { CartItem, GoodItemInterface } from '../types/pizza.types';
import { db } from '../../../shared/firebase';
import type { HistoryOrder } from '../../../shared/types/historyOrder';

class PizzaService {
  async fetchGoods(collectionName: string): Promise<GoodItemInterface[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as GoodItemInterface[];
    } catch (error) {
      return []
    }
  }

  async placeAnOrder(userId: string, cartItems: CartItem[], totalPrice: number): Promise<void> {
    try {
      const userOrdersRef = collection(db, 'users', userId, 'orders');
      const order: HistoryOrder = {
        uid: userId,
        items: cartItems,
        totalPrice: totalPrice,
        orderDate: Date.now(),
        status: "cooking"
      };

      const docRef = await addDoc(userOrdersRef, order);
      const orderId = docRef.id;
      
      await updateDoc(docRef, { id: orderId });
    } catch (error) {}
  }
}

export const pizzaService = new PizzaService();
