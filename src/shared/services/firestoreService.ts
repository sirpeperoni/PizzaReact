import { collection, doc, getDoc, getDocs, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import type { UserData } from "../../domains/auth/types/auth.types";
import { db } from "../firebase";
import { cartService } from "../../domains/cart/services/cartService";

class FirestoreService {
    private readonly usersCollection = 'users';
    private readonly usersRef = collection(db, 'users')

    async getUserFromFirestore(uid: string): Promise<UserData | null> {
        try {
            const q = query(this.usersRef, where('uid', '==', uid))
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data() as UserData;
                return {
                    uid,
                    email: userData.email,
                    username: userData.username || userData.email?.split('@')[0] || 'User',
                    role: userData.role,
                    ...userData
                };
            }

            return null
        } catch (err) {
            return null
        }
    }

    async updateUserProfile(uid: string, data: Partial<UserData>): Promise<void> {
        try {
            const userRef = doc(db, this.usersCollection, uid);
            await updateDoc(userRef, {
                ...data,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            
        }
    }



}

export const firestoreService = new FirestoreService();