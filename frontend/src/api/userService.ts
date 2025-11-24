import apiClient from './axiosConfig';
import { type UserDto, type RoleDto } from '../types/dto';

export const getAllUsers = async (): Promise<UserDto[]> => {
    const response = await apiClient.get('/users');
    return response.data;
};

export const updateUser = async (userId: number, user: { username: string, email: string }): Promise<UserDto> => {
    const response = await apiClient.put(`/users/${userId}`, user);
    return response.data;
};

export const updateUserRoles = async (userId: number, roles: RoleDto[]): Promise<UserDto> => {
    const response = await apiClient.put(`/users/${userId}/roles`, roles);
    return response.data;
};

export const deleteUser = async (userId: number): Promise<void> => {
    await apiClient.delete(`/users/${userId}`);
};
