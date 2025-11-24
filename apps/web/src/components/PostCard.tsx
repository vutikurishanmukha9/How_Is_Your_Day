import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@how-is-your-day/shared';
import { formatDate } from '@how-is-your-day/shared';

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Featured Image */}
            {post.featured_image && (
                <Link href={`/post/${post.slug}`}>
                    <div className="relative h-48 w-full bg-gray-200">
                        <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </Link>
            )}

            {/* Content */}
            <div className="p-6">
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                            <Link
                                key={tag}
                                href={`/tags/${tag}`}
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Title */}
                <Link href={`/post/${post.slug}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors line-clamp-2">
                        {post.title}
                    </h2>
                </Link>

                {/* Excerpt */}
                {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                )}

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <time dateTime={post.published_at || post.created_at}>
                        {formatDate(post.published_at || post.created_at, 'long')}
                    </time>
                    <Link
                        href={`/post/${post.slug}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Read more →
                    </Link>
                </div>
            </div>
        </article>
    );
}
