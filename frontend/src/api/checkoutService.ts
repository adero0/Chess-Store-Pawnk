import apiClient from './axiosConfig';

export interface OrderItemDto {
    productId: number;
    quantity: number;
}

export interface OrderDto {
    orderItems: OrderItemDto[];
}

export const createOrder = async (order: OrderDto): Promise<void> => {
    await apiClient.post('/orders', order);
};
