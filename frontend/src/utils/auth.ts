export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const clearToken = (): void => {
    localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};