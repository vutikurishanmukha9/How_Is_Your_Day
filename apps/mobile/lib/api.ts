const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
    // Posts
    async getPosts(page = 1, limit = 10) {
        const response = await fetch(`${API_URL}/api/posts?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        return response.json();
    },

    async getPostBySlug(slug: string) {
        const response = await fetch(`${API_URL}/api/posts/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        return response.json();
    },

    async getPostsByTag(tag: string, page = 1) {
        const response = await fetch(`${API_URL}/api/posts?tag=${tag}&page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        return response.json();
    },

    // Tags
    async getTags() {
        const response = await fetch(`${API_URL}/api/tags`);
        if (!response.ok) throw new Error('Failed to fetch tags');
        return response.json();
    },

    // Subscribe
    async subscribe(email: string) {
        const response = await fetch(`${API_URL}/api/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) throw new Error('Failed to subscribe');
        return response.json();
    },

    // Push Notifications
    async registerPushToken(token: string, platform: 'ios' | 'android') {
        const response = await fetch(`${API_URL}/api/push/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, platform }),
        });
        if (!response.ok) throw new Error('Failed to register push token');
        return response.json();
    },
};
