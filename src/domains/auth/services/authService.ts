import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../../shared/firebase";
import { firestoreService } from "../../../shared/services/firestoreService";
import type { LoginCredentials, UserData, RegisterData } from "../types";
import { doc, setDoc } from "firebase/firestore";

class AuthService {

    async login({ email, password }: LoginCredentials): Promise<UserData | null> {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password)
            const firebaseUser = userCredentials.user
            const user: UserData | null = await firestoreService.getUserFromFirestore(firebaseUser.uid)
            return user
        } catch (error) {
            throw this.handleAuthError(error)
        }
    }

    async register({email, password, username, role}: RegisterData): Promise<UserData | null> {
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredentials.user
            
            const user: UserData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                username: username || firebaseUser.email?.split('@')[0] || 'User',
                role: role || 'User'
            }
            await setDoc(doc(db, 'users', firebaseUser.uid), user);
            return user
        } catch (error) {
            throw this.handleAuthError(error)
        }
    }

    async logout(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    async getCurrentUser(): Promise<UserData | null> {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                unsubscribe();
                
                if (firebaseUser) {
                    const userInfo = await firestoreService.getUserFromFirestore(firebaseUser.uid);
                    resolve(userInfo);
                } else {
                    resolve(null);
                }
            });
        });
    }

    private handleAuthError(error: any): Error {
        const errorMap: Record<string, string> = {
            'auth/user-not-found': 'Пользователь не найден',
            'auth/wrong-password': 'Неверный пароль',
            'auth/email-already-in-use': 'Email уже используется',
            'auth/weak-password': 'Пароль должен быть не менее 6 символов',
            'auth/invalid-email': 'Неверный формат email',
            'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
            'auth/invalid-credential': "Неправильный email или пароль"
        };
        return new Error(errorMap[error.code] || error.message || 'Ошибка аутентификации');
    }

    
}

export const authService = new AuthService();