import apiClient from './axiosConfig';

export const requestPasswordReset = async (email: string): Promise<void> => {
    await apiClient.post('/password/reset-request', { email });
};

export const resetPassword = async (token: string, password: string): Promise<void> => {
    await apiClient.post('/password/reset', { token, password });
};
