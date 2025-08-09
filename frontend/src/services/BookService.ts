import type {Book} from "../types/Book.ts";
import apiClient from "./ApiClient.ts";

export const fetchAllBooks = async (): Promise<Book[]> => {
    const response = await apiClient.get<Book[]>("/books")
    return response.data
}

export const fetchBookIds = async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>("/books/bookIds")
    return response.data
}

/*export const fetchBookISBNs = async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>("/books/bookISBNs")
    return response.data
}*/

export const removeBook = async (_id: string) => {
    await apiClient.delete(`/books/${_id}`)
}

export const addBook = async (bookData: Omit<Book, "_id">) => {
    const response = await apiClient.post("/books", bookData);
    return response.data
}

export const updateBook = async (_id: string, bookData: Omit<Book, "_id">) => {
    const response = await apiClient.put(`/books/${_id}`, bookData);
    return response.data;
}