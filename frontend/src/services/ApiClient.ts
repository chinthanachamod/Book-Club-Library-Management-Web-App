import axios, {AxiosError} from "axios";

export const BASE_URL = "http://localhost:3000/api";

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

export const setHeader = (accessToken: string) => {
    if (accessToken !== "") {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }else {
        delete apiClient.defaults.headers.common["Authorization"];
    }
}

apiClient.interceptors.request.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response.status === 403 && !originalRequest.retry) {
            console.log(error)
            originalRequest.retry = true;
            try {
                const result = await apiClient.post("/auth/refresh-token")
                const newAccessToken = result.data.access_token
                setHeader(newAccessToken)
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
                return apiClient(originalRequest)
            }catch (error) {
                if (error instanceof AxiosError) {
                    if (error.response?.status === 401) {
                        window.location.href = "/login"
                    }
                }
            }
        }
    }
)

export default apiClient;