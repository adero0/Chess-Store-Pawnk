export interface CommentDto {
    id: number;
    content: string;
    authorName: string;
    createdAt: string; // LocalDateTime is serialized as a string
}

export interface RoleDto {
    id: number;
    name: 'ROLE_USER' | 'ROLE_MODERATOR' | 'ROLE_ADMIN';
}

export interface UserDto {
    id: number;
    username: string;
    email: string;
    roles: RoleDto[];
}