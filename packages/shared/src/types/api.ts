import { Post, Subscriber, PushToken } from './database';

// API Response wrapper
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Posts API
export interface GetPostsParams {
    page?: number;
    limit?: number;
    tag?: string;
    status?: 'draft' | 'published';
    search?: string;
}

export interface CreatePostRequest {
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    featured_image?: string;
    tags?: string[];
    status: 'draft' | 'published';
    published_at?: string;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
    id: number;
}

// Auth API
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
        display_name: string | null;
        is_admin: boolean;
    };
}

export interface RegisterRequest {
    email: string;
    password: string;
    display_name?: string;
}

// Subscribe API
export interface SubscribeRequest {
    email: string;
}

// Push Notifications
export interface RegisterPushTokenRequest {
    token: string;
    platform: 'ios' | 'android';
}

export interface SendNotificationRequest {
    title: string;
    body: string;
    data?: Record<string, any>;
}

// Tags
export interface TagWithCount {
    tag: string;
    count: number;
}
