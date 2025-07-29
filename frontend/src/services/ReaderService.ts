import axios from 'axios';
import type {Reader} from '../types';

const API_URL = 'http://localhost:5000/api'; // backend URL

export const getReaders = async (): Promise<Reader[]> => {
    const response = await axios.get(`${API_URL}/readers`);
    return response.data;
};

export const getReaderById = async (id: string): Promise<Reader> => {
    const response = await axios.get(`${API_URL}/readers/${id}`);
    return response.data;
};

export const addReader = async (reader: Omit<Reader, 'id'>): Promise<Reader> => {
    const response = await axios.post(`${API_URL}/readers`, reader);
    return response.data;
};

export const updateReader = async (id: string, reader: Partial<Reader>): Promise<Reader> => {
    const response = await axios.put(`${API_URL}/readers/${id}`, reader);
    return response.data;
};

export const deleteReader = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/readers/${id}`);
};

export const searchReaders = async (query: string): Promise<Reader[]> => {
    const response = await axios.get(`${API_URL}/readers/search`, {
        params: { q: query }
    });
    return response.data;
};