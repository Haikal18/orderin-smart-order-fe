export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    data: User;
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