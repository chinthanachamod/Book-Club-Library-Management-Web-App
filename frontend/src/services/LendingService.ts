import type {Lending} from "../types/Lending.ts";
import apiClient from "./ApiClient.ts";

// lend book
export const lendBook = async (data: Omit<Lending, "id" | "status" | "returnDate">) => {
    const response = await apiClient.post("/lendings", data)
    return response.data
}

// mark as returned
export const markAsReturned = async (_id: string) => {
    const response = await apiClient.put(`/lendings/${_id}/return`)
    return response.data
}

// view lending history (all)
export const fetchAllLendings = async (): Promise<Lending[]> => {
    const response = await apiClient.get<Lending[]>("/lendings");
    return response.data
}

// view lending history by book
export const fetchLendingsByBookId = async (bookId: string): Promise<Lending[]> => {
    const response = await apiClient.get(`/lendings?bookId=${bookId}`)
    return response.data
}

// view lending history by reader
export const fetchLendingsByReaderId = async (readerId: string): Promise<Lending[]> => {
    const response = await apiClient.get(`/lendings?readerId=${readerId}`)
    return response.data
}

// delete lending
export const removeLending = async (_id: string) => {
    await apiClient.delete(`/lendings/${_id}`)
}