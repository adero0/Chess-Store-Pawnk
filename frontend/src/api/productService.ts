import apiClient from './axiosConfig';

// Definicja typu dla danych produktu, które otrzymujemy z backendu
export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    categoryName: string;
    authorName: string;
    imageUrl: string;
}

const API_URL_PRODUCTS = '/products';

export const getProducts = async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(API_URL_PRODUCTS);
    return response.data;
};

export const getProductsByCategory = async (categoryName: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`${API_URL_PRODUCTS}/category/${categoryName}`);
    return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`${API_URL_PRODUCTS}/${id}`);
    return response.data;
};
