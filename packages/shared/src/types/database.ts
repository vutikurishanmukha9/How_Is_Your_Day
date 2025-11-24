// Database table interfaces

export interface User {
    id: number;
    email: string;
    password_hash: string;
    display_name: string | null;
    is_admin: boolean;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    author_id: number | null;
    status: 'draft' | 'published';
    featured_image: string | null;
    tags: string[] | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Subscriber {
    id: number;
    email: string;
    confirmed: boolean;
    confirm_token: string | null;
    subscribed_at: string;
}

export interface Comment {
    id: number;
    post_id: number;
    author_name: string | null;
    author_email: string | null;
    body: string;
    is_moderated: boolean;
    created_at: string;
}

export interface PushToken {
    id: number;
    token: string;
    platform: 'ios' | 'android';
    created_at: string;
}

// Extended types with relations
export interface PostWithAuthor extends Post {
    author?: Pick<User, 'id' | 'display_name' | 'email'>;
}

export interface CommentWithPost extends Comment {
    post?: Pick<Post, 'id' | 'title' | 'slug'>;
}
