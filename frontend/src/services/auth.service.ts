import api from './api';
import type {LoginFormData, RegisterFormData, User} from '../types';

export const login = async (data: LoginFormData) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

export const register = async (data: RegisterFormData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.user;
};