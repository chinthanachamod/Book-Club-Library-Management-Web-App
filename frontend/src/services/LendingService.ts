import axios from 'axios';
import type {Lending, Overdue} from '../types';

const API_URL = 'http://localhost:5000/api'; // backend URL

export const getLendings = async (): Promise<Lending[]> => {
    const response = await axios.get(`${API_URL}/lendings`);
    return response.data;
};

export const getLendingById = async (id: string): Promise<Lending> => {
    const response = await axios.get(`${API_URL}/lendings/${id}`);
    return response.data;
};

export const addLending = async (lending: Omit<Lending, 'id'>): Promise<Lending> => {
    const response = await axios.post(`${API_URL}/lendings`, lending);
    return response.data;
};

export const updateLending = async (id: string, lending: Partial<Lending>): Promise<Lending> => {
    const response = await axios.put(`${API_URL}/lendings/${id}`, lending);
    return response.data;
};

export const deleteLending = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/lendings/${id}`);
};

export const returnBook = async (lendingId: string): Promise<Lending> => {
    const response = await axios.patch(`${API_URL}/lendings/${lendingId}/return`);
    return response.data;
};

export const getOverdueLendings = async (): Promise<Overdue[]> => {
    const response = await axios.get(`${API_URL}/lendings/overdue`);
    return response.data;
};

export const sendOverdueNotifications = async (): Promise<void> => {
    await axios.post(`${API_URL}/lendings/notify-overdue`);
};