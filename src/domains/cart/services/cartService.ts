import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import type { CartItem } from "../types/cart.types";
import { db } from "../../../shared/firebase";

class CartService {
    async addToCart(item: CartItem, userId: string | undefined): Promise<void> {
        try {
            if(userId){
                const userOrdersRef = collection(db, 'users', userId, 'cart');
                const docId = doc(userOrdersRef).id;
                const { id, ...itemWithoutId } = item;
                const addNewDoc = {
                    id: docId,
                    ...itemWithoutId
                }
                await setDoc(doc(userOrdersRef, docId), addNewDoc);
            }
        } catch (error) {
            throw error
        }
    }

    async removeFromCart(item: CartItem, userId: string): Promise<void> {
        try {
            const cartItemRef = doc(db, 'users', userId, 'cart', item.id);
            await deleteDoc(cartItemRef);
        } catch (error) {
            throw error
        }
    }

    async updateCartItem(itemId: string, userId: string, updatedData: Partial<CartItem>): Promise<void> {
        try {
            const itemRef = doc(db, 'users', userId, 'cart', itemId);
            await updateDoc(itemRef, updatedData);
        } catch (error) {
            throw error
        }
    }

    async updateCartItemQuantity(itemId: string, userId: string, quantity: number): Promise<void> {
        try {
            const itemRef = doc(db, 'users', userId, 'cart', itemId);
            await updateDoc(itemRef, { quantity });
        } catch (error) {
            throw error
        }
    }

    async getUserCart(userId: string): Promise<(CartItem)[]> {
        try {
            const cartRef = collection(db, 'users', userId, 'cart');
            const cartSnapshot = await getDocs(cartRef);
            
            const cartItems: (CartItem)[] = [];
            cartSnapshot.forEach((doc) => {
                cartItems.push({
                    ...doc.data() as CartItem
                });
            });
            return cartItems;
        } catch (error) {
            throw error
        }
    }

    async clearCart(userId: string): Promise<void> {
        try {
            const cartRef = collection(db, 'users', userId, 'cart');
            const cartSnapshot = await getDocs(cartRef);
            
            const deletePromises = cartSnapshot.docs.map(doc => 
                deleteDoc(doc.ref)
            );
            
            await Promise.all(deletePromises);
        } catch (error) {
            throw error
        }
    }
}

export const cartService = new CartService()