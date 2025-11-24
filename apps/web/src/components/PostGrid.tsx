import { Post } from '@how-is-your-day/shared';
import PostCard from './PostCard';

interface PostGridProps {
    posts: Post[];
}

export default function PostGrid({ posts }: PostGridProps) {
    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No posts found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}
