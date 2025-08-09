import type {User} from "../types/User.ts";
import type {LoginFormData} from "../pages/LoginPage.tsx";
import apiClient from "./ApiClient.ts";

export interface SignUpResponse {
    name: string;
    email: string;
    _id: string;
}

export interface LoginResponse {
    name: string;
    email: string;
    accessToken: string;
    _id: string;
}

export interface LogoutResponse {
    message: string
}

export const signup = async (userData: User): Promise<SignUpResponse> => {
    const response = await apiClient.post("/auth/signup", userData)
    return response.data
}

export const login = async (loginData: LoginFormData): Promise<LoginResponse> => {
    const response = await apiClient.post("/auth/login", loginData)
    return response.data
}

export const logout = async (): Promise<LogoutResponse> => {
    const response = await apiClient.post("/auth/logout")
    return response.data
}