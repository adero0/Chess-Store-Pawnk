import apiClient from './axiosConfig';
import type { OrderDto } from '../types/dto';

export const getMyOrders = async (): Promise<OrderDto[]> => {
    const response = await apiClient.get<OrderDto[]>('/orders');
    return response.data;
};

export const getAllOrders = async (): Promise<OrderDto[]> => {
    const response = await apiClient.get<OrderDto[]>('/orders/all');
    return response.data;
};

export const updateOrderStatus = async (orderId: number, status: string): Promise<void> => {
    await apiClient.put(`/orders/${orderId}/status`, status, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
};