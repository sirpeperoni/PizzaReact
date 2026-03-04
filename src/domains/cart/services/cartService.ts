import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { CartItem } from "../types/cart.types";
import { auth, db } from "../../../shared/firebase";

class CartService {
  async addToCart(item: CartItem): Promise<void> {
    try {
      if (this.userId) {
        const userOrdersRef = collection(db, "users", this.userId, "cart");
        const docId = doc(userOrdersRef).id;
        const { id, ...itemWithoutId } = item;
        const addNewDoc = {
          id: docId,
          ...itemWithoutId,
        };
        await setDoc(doc(userOrdersRef, docId), addNewDoc);
      }
    } catch (error) {
      throw error;
    }
  }

  async removeFromCart(item: CartItem, userId: string): Promise<void> {
    try {
      const cartItemRef = doc(db, "users", userId, "cart", item.id);
      await deleteDoc(cartItemRef);
    } catch (error) {
      throw error;
    }
  }

  async updateCartItem(
    itemId: string,
    userId: string,
    updatedData: Partial<CartItem>,
  ): Promise<void> {
    try {
      const itemRef = doc(db, "users", userId, "cart", itemId);
      await updateDoc(itemRef, updatedData);
    } catch (error) {
      throw error;
    }
  }

  async updateCartItemQuantity(
    itemId: string,
    userId: string,
    quantity: number,
  ): Promise<void> {
    try {
      const itemRef = doc(db, "users", userId, "cart", itemId);
      await updateDoc(itemRef, { quantity });
    } catch (error) {
      throw error;
    }
  }

  async getUserCart(): Promise<CartItem[]> {
    if (this.userId) {
      const cartRef = collection(db, "users", this.userId, "cart");
      const cartSnapshot = await getDocs(cartRef);

      const rawData = cartSnapshot.docs.map<CartItem>(
        (doc) => doc.data() as CartItem,
      );

      return rawData.reduce<CartItem[]>((acc, curr) => {
          const pizzaId = `${curr.name}.${curr.settings?.size ?? ''}.${curr.settings?.size ?? ''}`;

          const existingItem = acc.find((item) => item.pizzaId === pizzaId);
          if (existingItem) {
            existingItem.quantity += curr.quantity;
          } else {
            acc.push({ ...curr, pizzaId });
          }

        return acc;
      }, []);
    }

    return [];
  }

  async clearCart(userId: string): Promise<void> {
    try {
      const cartRef = collection(db, "users", userId, "cart");
      const cartSnapshot = await getDocs(cartRef);

      const deletePromises = cartSnapshot.docs.map((doc) => deleteDoc(doc.ref));

      await Promise.all(deletePromises);
    } catch (error) {
      throw error;
    }
  }

  get userId(): string | undefined {
    return auth.currentUser?.uid;
  }
}

export const cartService = new CartService();
