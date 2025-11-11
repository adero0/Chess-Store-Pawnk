import apiClient from './axiosConfig';
import { type CommentDto } from '../types/dto'; // I'll need to create this type

export const getCommentsForProduct = async (productId: string): Promise<CommentDto[]> => {
    const response = await apiClient.get<CommentDto[]>(`/products/${productId}/comments`);
    return response.data;
};

export const addComment = async (productId: string, content: string): Promise<CommentDto> => {
    const response = await apiClient.post<CommentDto>(`/products/${productId}/comments`, { content });
    return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
    await apiClient.delete(`/comments/${commentId}`);
};
