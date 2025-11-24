/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @param format - Format type ('short', 'long', 'relative')
 * @returns Formatted date string
 */
export function formatDate(
    dateString: string,
    format: 'short' | 'long' | 'relative' = 'long'
): string {
    const date = new Date(dateString);

    if (format === 'relative') {
        return getRelativeTime(date);
    }

    const options: Intl.DateTimeFormatOptions =
        format === 'short'
            ? { year: 'numeric', month: 'short', day: 'numeric' }
            : { year: 'numeric', month: 'long', day: 'numeric' };

    return date.toLocaleDateString('en-US', options);
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param date - Date object
 * @returns Relative time string
 */
function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / seconds);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}

/**
 * Check if a date is in the future
 * @param dateString - ISO date string
 * @returns True if date is in the future
 */
export function isFutureDate(dateString: string): boolean {
    return new Date(dateString) > new Date();
}

/**
 * Format date for datetime-local input
 * @param date - Date object or ISO string
 * @returns Formatted string for datetime-local input
 */
export function formatForDateTimeInput(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().slice(0, 16);
}
