import axios from 'axios';
import type {Book} from '../types';

const API_URL = 'http://localhost:5000/api'; // backend URL

export const getBooks = async (): Promise<Book[]> => {
    const response = await axios.get(`${API_URL}/books`);
    return response.data;
};

export const addBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
    const response = await axios.post(`${API_URL}/books`, book);
    return response.data;
};

export const updateBook = async (id: string, book: Partial<Book>): Promise<Book> => {
    const response = await axios.put(`${API_URL}/books/${id}`, book);
    return response.data;
};

export const deleteBook = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/books/${id}`);
};