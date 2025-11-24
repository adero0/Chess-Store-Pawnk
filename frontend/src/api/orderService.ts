import apiClient from './axiosConfig';
import type { OrderDto } from '../types/dto';

export const getMyOrders = async (): Promise<OrderDto[]> => {
    const response = await apiClient.get<OrderDto[]>('/orders');
    return response.data;
};
