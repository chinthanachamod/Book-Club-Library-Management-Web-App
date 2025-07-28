import { createContext, useContext, type ReactNode, useState, useEffect } from 'react';
import type {User} from '../types';
import { getCurrentUser } from '../services/auth.service';
import { getToken, clearToken } from '../utils/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = getToken();
            if (token) {
                try {
                    const user = await getCurrentUser();
                    setUser(user);
                } catch (error) {
                    console.error('Failed to fetch current user', error);
                    clearToken();
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        getCurrentUser()
            .then((user) => {
                setUser(user);
            })
            .catch((error) => {
                console.error('Failed to fetch current user after login', error);
                clearToken();
            });
    };

    const logout = () => {
        clearToken();
        setUser(null);
    };

    const value = { user, loading, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}