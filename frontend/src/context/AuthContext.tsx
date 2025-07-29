import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { login as authLogin, signup as authSignup } from '../services/AuthService';

interface AuthContextType {
    user: any;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        // Load user data if token exists
        if (token) {
            // You might want to verify token or fetch user data here

        }
    }, [token]);

    const login = async (email: string, password: string) => {
        const { user, token } = await authLogin(email, password);
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
    };

    const signup = async (name: string, email: string, password: string) => {
        const { user, token } = await authSignup(name, email, password);
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};