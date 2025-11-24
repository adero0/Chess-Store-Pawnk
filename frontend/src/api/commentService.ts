import apiClient from './axiosConfig';
import type { CommentDto } from '../types/dto';

export const getCommentsForProduct = async (productId: number): Promise<CommentDto[]> => {
    const response = await apiClient.get<CommentDto[]>(`/comments/product/${productId}`);
    return response.data;
};

export const createComment = async (productId: number, content: string): Promise<CommentDto> => {
    const response = await apiClient.post<CommentDto>(`/comments/product/${productId}`, { content });
    return response.data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
    await apiClient.delete(`/comments/${commentId}`);
};

export const getPendingComments = async (): Promise<CommentDto[]> => {
    const response = await apiClient.get<CommentDto[]>('/comments/pending');
    return response.data;
};

export const updateCommentStatus = async (commentId: number, status: 'ACCEPTED' | 'REJECTED'): Promise<void> => {
    await apiClient.put(`/comments/${commentId}/status?status=${status}`);
};

export const getPendingCommentsCount = async (): Promise<number> => {
    const response = await apiClient.get<number>('/comments/pending/count');
    return response.data;
};
