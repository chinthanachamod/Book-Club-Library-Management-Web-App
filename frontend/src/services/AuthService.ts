import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';   // backend URL

interface AuthResponse {
    user: any;
    token: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};

export const signup = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/signup`, { name, email, password });
    return response.data;
};

export const verifyToken = async (token: string): Promise<boolean> => {
    try {
        await axios.get(`${API_URL}/verify`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return true;
    } catch (error) {
        return false;
    }
};