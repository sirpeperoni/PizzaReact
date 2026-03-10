import {  collection, getDocs } from "firebase/firestore";
import type { HistoryOrder } from "../../../shared/types/historyOrder";
import {  db } from "../../../shared/firebase";
import { firestoreService } from "../../../shared/services/firestoreService";

class ProfileService {
    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async fetchHistory(): Promise<HistoryOrder[]> {
        const uid = firestoreService.userId
        try {
            if(uid) {
                const userOrdersRef = collection(db, 'users', uid, 'orders')
                const querySnapshot = await getDocs(userOrdersRef)
                const documents = querySnapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data()
                })) as HistoryOrder[]

                return documents
            }

            return []
        } catch (error) {
            console.error('Error in fetchHistory:', {
                error,
                userId: firestoreService.userId,
                timestamp: new Date().toISOString()
            });
            return []
        }
    }
}

export const profileService = new ProfileService();