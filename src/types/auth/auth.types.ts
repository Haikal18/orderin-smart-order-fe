export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}