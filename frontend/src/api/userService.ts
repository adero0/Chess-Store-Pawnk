import apiClient from './axiosConfig';
import { type User, type RoleDto } from '../types/dto';
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
    sub: string;
}

export const getAllUsers = async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    const decodedToken: DecodedToken = jwtDecode(token);
    const username = decodedToken.sub;
    const response = await apiClient.get(`/users/by-username/${username}`);
    return response.data;
}


export const updateUser = async (userId: number, user: { username: string, email: string }): Promise<User> => {
    const response = await apiClient.put(`/users/${userId}`, user);
    return response.data;
};

export const updateUserRoles = async (userId: number, roles: RoleDto[]): Promise<User> => {
    const response = await apiClient.put(`/users/${userId}/roles`, roles);
    return response.data;
};

export const updateUserShippingDetails = async (userId: number, shippingDetails: { shippingName: string, shippingAddress: string, shippingCity: string, shippingPostalCode: string, shippingCountry: string }): Promise<User> => {
    const response = await apiClient.put(`/users/${userId}/shipping`, shippingDetails);
    return response.data;
};


export const deleteUser = async (userId: number): Promise<void> => {
    await apiClient.delete(`/users/${userId}`);
};
