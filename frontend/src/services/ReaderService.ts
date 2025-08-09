import type {Reader} from "../types/Reader.ts";
import apiClient from "./ApiClient.ts";

export const fetchAllReaders = async (): Promise<Reader[]> => {
    const response = await apiClient.get<Reader[]>("/readers")
    return response.data
}

export const fetchReaderIds = async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>("/readers/readerIds")
    return response.data
}

/*export const fetchReaderNames = async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>("/readers/readerNames")
    return response.data
}*/

export const removeReaders = async (_id: string) => {
    await apiClient.delete(`/readers/${_id}`)
}

export const addReader = async (readerData: Omit<Reader, "_id">) => {
    const response = await apiClient.post("/readers", readerData);
    return response.data;
}

export const updateReader = async (_id: string, readerData: Omit<Reader, "_id">) => {
    const response = await apiClient.put(`/readers/${_id}`, readerData);
    return response.data;
}