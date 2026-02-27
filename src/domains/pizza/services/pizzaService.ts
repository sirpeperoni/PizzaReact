import { addDoc, collection, getDocs } from "firebase/firestore";
import type { CartItem, GoodItemInterface } from "../types/pizza.types";
import { db } from "../../../shared/firebase";

class PizzaService {
    async fetchGoods(collectionName: string): Promise<GoodItemInterface[]> {
        try {
            const querySnapshot = await getDocs(collection(db, collectionName));
            const goodsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as GoodItemInterface[];
            return goodsData;
        } catch (error) {
            throw error;
        }
    }

    async placeAnOrder(userId: string, cartItems: CartItem[], totalPrice: number): Promise<void> {
        try {
            const userOrdersRef = collection(db, 'users', userId, 'orders');
            const order = {
                uid: userId,
                items: cartItems,
                totalPrice: totalPrice
            }
            await addDoc(userOrdersRef, order);
        } catch (error) {
            
        }
        
    }
}


export const pizzaService = new PizzaService();