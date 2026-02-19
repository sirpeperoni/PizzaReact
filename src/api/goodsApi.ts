import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase"; // путь к вашему файлу с конфигурацией firebase
import type { GoodItemInterface } from "../Widgets/GoodsList/GoodsList";
import type { CartItem } from "../store/cartSlice";

export const goodsApi = {
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
    },

    async placeAnOrder(userId: string, cartItems: CartItem[], totalPrice: number) {
        const userOrdersRef = collection(db, 'users', userId, 'orders');
        const order = {
            uid: userId,
            items: cartItems,
            totalPrice: totalPrice
        }
        await addDoc(userOrdersRef, order);
        
    }
};