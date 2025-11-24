export interface CommentDto {
    id: number;
    content: string;
    authorName: string;
    createdAt: string; // LocalDateTime is serialized as a string
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    productId: number;
    productName: string;
}

export interface CategoryDto {
    id: number;
    name: string;
}

export interface RoleDto {
    id: number;
    name: 'ROLE_USER' | 'ROLE_MODERATOR' | 'ROLE_ADMIN';
    categoryId?: number;
}

export interface UserDto {
    id: number;
    username: string;
    email: string;
    roles: RoleDto[];
}

export interface OrderItemDto {
    productId: number;
    quantity: number;
    productName: string;
    price: number;
}

export interface OrderDto {
    id: number;
    orderItems: OrderItemDto[];
    totalPrice: number;
    orderDate: string;
    deliveryDate: string;
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}