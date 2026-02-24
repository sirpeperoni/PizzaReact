export interface UserData {
    uid?: string;
    email?: string | null
    username?: string;
    role?: Roles;
}

export interface AuthState {
    user?: UserData | null;
    isLoading?: boolean;
    error?: string | null;
    isAuthenticated?: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    username: string;
    role?: Roles
}

export type Roles = 'Admin' | 'User'