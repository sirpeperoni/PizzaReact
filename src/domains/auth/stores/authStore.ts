import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";
import type { AuthState, LoginCredentials, RegisterData, UserData } from "../types";
import { authService } from "../services/authService";
import { firestoreService } from "../../../shared/services/firestoreService";

interface AuthStore extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    registerProfile: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<UserData>) => Promise<void>;
    clearError: () => void;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false
};

export const useAuthStore = create<AuthStore>()(
    persist(
        devtools(
            combine(initialState, (set, get) => {
                return {
                    login: async (credentials: LoginCredentials) => {
                        set({ isLoading: true, error: null })
                        try {
                            const user = await authService.login(credentials)
                            set({
                                user: user,
                                isAuthenticated: true
                            })
                        } catch (error: any) {
                            set({
                                error: error.message || 'Login failed'
                            });
                        } finally {
                            set({ isLoading: false })
                        }
                    },
                    registerProfile: async (data: RegisterData) => {
                        set({ isLoading: true, error: null })
                        try {
                            const user = await authService.register(data)
                            console.log(1)
                            set({
                                user: user,
                                isAuthenticated: true
                            })
                        } catch (error: any) {
                            console.log(2)
                            set({
                                error: error.message || 'Registration failed'
                            });
                        } finally {
                            console.log(3)
                            set({ isLoading: false })
                        }
                    },
                    logout: async () => {
                        set({ isLoading: true });
                        try {
                            await authService.logout()
                            set({
                                user: null,
                                isAuthenticated: false
                            })
                        } catch (error: any) {
                            set({
                                error: error.message || 'Logout failed'
                            });
                        } finally {
                            set({ isLoading: false })
                        }
                    },
                    updateProfile: async (data: Partial<UserData>) => {
                        const currentUser = get().user;
                        if (!currentUser) return;
                        set({ isLoading: true, error: null });
                        try {
                            if (currentUser.uid) {
                                await firestoreService.updateUserProfile(currentUser.uid, data);
                            }
                            set({
                                user: { ...currentUser, ...data },
                            })
                        } catch (error: any) {
                            set({
                                error: error.message || 'Logout failed'
                            });
                        } finally {
                            set({ isLoading: false })
                        }
                    },
                    clearError: () => set({ error: null }),
                }
            }),
            { name: 'auth-store' }
        ),
        {
            name: 'auth-storage',
            partialize: (state) => ({ 
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);