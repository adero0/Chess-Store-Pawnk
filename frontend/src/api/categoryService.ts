import apiClient from './axiosConfig';
import { type CategoryDto } from '../types/dto';

const API_URL_CATEGORIES = '/categories';

export const getAllCategories = async (): Promise<CategoryDto[]> => {
    const response = await apiClient.get<CategoryDto[]>(API_URL_CATEGORIES);
    return response.data;
};
