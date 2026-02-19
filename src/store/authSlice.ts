import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {auth, db} from '../firebase'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

interface UserData {
    email: string;
    username?: string;
    password: string;
    role?: string;
}
  
export interface AuthState {
    user: UserInfo | null;
    isLoading: boolean;
    error: string | null | undefined;
}

export interface UserInfo {
    uid?: string;
    email?: string | null
    username?: string;
    role?: string;
}
  
const initialState: AuthState = {
    user: null,
    isLoading: true,
    error: null
};


export const login = createAsyncThunk<UserInfo, UserData>(
    'auth/login',
    async ({ email, password }: UserData) => {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const userInfo = await getUserFromFirestore(firebaseUser.uid, firebaseUser.email);
      return userInfo;
    }
);
  
export const register = createAsyncThunk<UserInfo, UserData>(
    'auth/register',
    async ({ email, password, username, role }: UserData) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        const userInfo: UserInfo = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: username || firebaseUser.email?.split('@')[0] || 'User',
            role
        };
        try {
            await setDoc(doc(db, 'users', firebaseUser.uid), userInfo);
        } catch (error) {

        }
        return userInfo;
    }
);
  
export const logout = createAsyncThunk<void, void>(
    'auth/logout',
    async () => {
      await signOut(auth);
    }
);

export const getUserFromFirestore = async (uid: string, email: string | null): Promise<UserInfo> => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data() as UserInfo;
            return {
                uid,
                email,
                username: userData.username || email?.split('@')[0] || 'User',
                role: userData.role,
                ...userData
            };
        }

        return {
            uid,
            email,
            username: email?.split('@')[0] || 'User',
            role: "User"
        };
    } catch (error) {
        return {
            uid,
            email,
            username: email?.split('@')[0] || 'User',
            role: "User"
        };
    }
};

export const getCurrentUser = createAsyncThunk<UserInfo | null, void>(
    'auth/getCurrentUser',
    async () => {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                unsubscribe();
                
                if (firebaseUser) {
                    const userInfo = await getUserFromFirestore(firebaseUser.uid, firebaseUser.email);
                    resolve(userInfo);
                } else {
                    resolve(null);
                }
            });
        });
    }
);


export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
      setUser: (state, action) => {
        state.user = {
          email: action.payload.email
        };
        state.isLoading = false;
      },
      clearUser: (state) => {
        state.user = null;
        state.isLoading = false;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(login.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(login.fulfilled, (state, action: PayloadAction<UserInfo>) => {
            state.isLoading = false;
            state.user = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })



        .addCase(register.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(register.fulfilled, (state, action: PayloadAction<UserInfo>) => {
            state.isLoading = false;
            state.user = action.payload;
        })
        .addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })



        .addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.isLoading = false;
        })



        .addCase(getCurrentUser.pending, (state) => {
            state.isLoading = true
            state.error = null;
        })
        .addCase(getCurrentUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
        })
        .addCase(getCurrentUser.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message;
        })
    }
});
  
export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;