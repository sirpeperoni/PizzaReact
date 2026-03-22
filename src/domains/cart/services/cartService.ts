import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import type { CartItem } from '../types/cart.types';
import { db } from '../../../shared/firebase';
import { firestoreService } from '../../../shared/services/firestoreService';

class CartService {
  async addToCart(item: CartItem): Promise<void> {
    try {
      const uid = firestoreService.userId;
      if (uid) {
        const userOrdersRef = collection(db, 'users', uid, 'cart');
        const docId = doc(userOrdersRef).id;
        const { id, ...itemWithoutId } = item;
        const addNewDoc = {
          id: docId,
          ...itemWithoutId,
        };
        await setDoc(doc(userOrdersRef, docId), addNewDoc);
      }
    } catch (error) {
      console.error('Error add to cart:', error);
      throw error;
    }
  }

  async removeFromCart(item: CartItem): Promise<void> {
    try {
      const userId = firestoreService.userId;
      if (userId) {
        const cartItemRef = doc(db, 'users', userId, 'cart', item.id);
        await deleteDoc(cartItemRef);
      }
    } catch (error) {
      console.error('Error remove from cart:', error);
      throw error;
    }
  }

  async updateCartItem(itemId: string, updatedData: Partial<CartItem>): Promise<void> {
    try {
      const userId = firestoreService.userId;
      if (userId) {
        const itemRef = doc(db, 'users', userId, 'cart', itemId);
        await updateDoc(itemRef, updatedData);
      }
    } catch (error) {
      console.error('Error cart item:', error);
      throw error;
    }
  }

  async updateCartItemQuantity(itemId: string, quantity: number): Promise<void> {
    try {
      const userId = firestoreService.userId;
      if (userId) {
        const itemRef = doc(db, 'users', userId, 'cart', itemId);
        await updateDoc(itemRef, { quantity });
      }
    } catch (error) {
      console.error('Error update cart item quantity:', error);
      throw error;
    }
  }

  async getUserCart(): Promise<CartItem[]> {
    try {
      const uid = firestoreService.userId;
      if (uid) {
        const cartRef = collection(db, 'users', uid, 'cart');
        const cartSnapshot = await getDocs(cartRef);

        const rawData = cartSnapshot.docs.map<CartItem>(doc => doc.data() as CartItem);

        return rawData.reduce<CartItem[]>((acc, curr) => {
          const pizzaId = `${curr.name}.${curr.settings?.size ?? ''}.${curr.settings?.dough ?? ''}`;

          const existingItem = acc.find(item => item.pizzaId === pizzaId);
          if (existingItem) {
            existingItem.quantity += curr.quantity;
          } else {
            acc.push({ ...curr, pizzaId });
          }

          return acc;
        }, []);
      }

      return [];
    } catch (error) {
      console.error('Error get user cart:', error);
      return [];
    }
  }

  async clearCart(): Promise<void> {
    try {
      const userId = firestoreService.userId;
      if (userId) {
        const cartRef = collection(db, 'users', userId, 'cart');
        const cartSnapshot = await getDocs(cartRef);
        const deletePromises = cartSnapshot.docs.map(doc => deleteDoc(doc.ref));

        await Promise.all(deletePromises);
      }
    } catch (error) {
      console.error('Error clear cart:', error);
    }
  }
}

export const cartService = new CartService();
