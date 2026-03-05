import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";
import type {
  AuthState,
  LoginCredentials,
  RegisterData,
  UserData,
} from "../types";
import { authService } from "../services/authService";
import { firestoreService } from "../../../shared/services/firestoreService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../shared/firebase";
import { cartService } from "../../cart/services/cartService";

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  registerProfile: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserData>) => Promise<void>;
  clearError: () => void;
  initAuth: () => () => void;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    devtools(
      combine(initialState, (set, get) => {
        return {
          login: async (credentials: LoginCredentials) => {
            set({ isLoading: true, error: null });
            try {
              await authService.login(credentials);
            } catch (error: any) {
              set({
                error: error.message || "Login failed",
                isLoading: false,
              });
            }
          },
          registerProfile: async (data: RegisterData) => {
            set({ isLoading: true, error: null });
            try {
              await authService.register(data);
            } catch (error: any) {
              set({
                error: error.message || "Registration failed",
                isLoading: false,
              });
            }
          },
          logout: async () => {
            set({ isLoading: true });
            try {
              await authService.logout();
            } catch (error: any) {
              set({
                error: error.message || "Logout failed",
                isLoading: false,
              });
            }
          },
          updateProfile: async (data: Partial<UserData>) => {
            const currentUser = get().user;
            if (!currentUser) return;
            set({ isLoading: true, error: null });
            try {
              if (currentUser.uid) {
                await firestoreService.updateUserProfile(currentUser.uid, data);
                set({
                  user: { ...currentUser, ...data },
                });
              }
            } catch (error: any) {
              set({
                error: error.message || "Logout failed",
              });
            }
          },
          clearError: () => set({ error: null }),
          initAuth: () => {
            const unsubscribe = onAuthStateChanged(
              auth,
              async (firebaseUser) => {
                const currentUser = get().user;
                set({ isLoading: true });
                try {
                  if (firebaseUser) {
                    if (!currentUser || currentUser.uid !== firebaseUser.uid) {
                      const user = await firestoreService.getUserFromFirestore(
                        firebaseUser.uid,
                      );
                      set({
                        user: user,
                        isAuthenticated: true,
                      });
                    }
                  } else {
                    set({
                      user: null,
                      isAuthenticated: false,
                    });
                  }
                } catch (error) {
                  set({
                    user: null,
                    isAuthenticated: false,
                    error: "Failed to load user data",
                  });
                } finally {
                  set({ isLoading: false });
                }
              },
            );
            return unsubscribe;
          },
        };
      }),
      { name: "auth-store" },
    ),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
