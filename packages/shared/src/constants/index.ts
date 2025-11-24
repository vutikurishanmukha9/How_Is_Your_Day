// Post statuses
export const POST_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
} as const;

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
} as const;

// Post limits
export const POST_LIMITS = {
    TITLE_MAX_LENGTH: 200,
    EXCERPT_MAX_LENGTH: 300,
    SLUG_MAX_LENGTH: 200,
} as const;

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Image upload
export const IMAGE_UPLOAD = {
    MAX_SIZE_MB: 5,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
} as const;

// Push notification platforms
export const PUSH_PLATFORMS = {
    IOS: 'ios',
    ANDROID: 'android',
} as const;
