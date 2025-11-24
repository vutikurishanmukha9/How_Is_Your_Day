import { supabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import MarkdownContent from '@/components/MarkdownContent';
import ShareButtons from '@/components/ShareButtons';
import Link from 'next/link';
import { formatDate } from '@how-is-your-day/shared';
import { PostWithAuthor } from '@how-is-your-day/shared';
import { Metadata } from 'next';

interface PageProps {
    params: { slug: string };
}

async function getPost(slug: string): Promise<PostWithAuthor | null> {
    const { data, error } = await supabaseServer
        .from('posts_with_author')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error || !data) {
        return null;
    }

    return data;
}

async function getRelatedPosts(slug: string, tags: string[]): Promise<PostWithAuthor[]> {
    if (!tags || tags.length === 0) {
        return [];
    }

    const { data, error } = await supabaseServer
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .neq('slug', slug)
        .overlaps('tags', tags)
        .limit(3);

    if (error || !data) {
        return [];
    }

    return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const post = await getPost(params.slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | How Is Your Day`,
        description: post.excerpt || post.content.substring(0, 160),
        openGraph: {
            title: post.title,
            description: post.excerpt || post.content.substring(0, 160),
            images: post.featured_image ? [post.featured_image] : [],
            type: 'article',
            publishedTime: post.published_at || undefined,
            authors: post.author_name ? [post.author_name] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt || post.content.substring(0, 160),
            images: post.featured_image ? [post.featured_image] : [],
        },
    };
}

export default async function PostPage({ params }: PageProps) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = await getRelatedPosts(params.slug, post.tags || []);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const postUrl = `${siteUrl}/post/${post.slug}`;

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Featured Image */}
            {post.featured_image && (
                <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden">
                    <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                        <Link
                            key={tag}
                            href={`/tags/${tag}`}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full"
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
                <time dateTime={post.published_at || post.created_at}>
                    {formatDate(post.published_at || post.created_at, 'long')}
                </time>
                {post.author_name && (
                    <>
                        <span>•</span>
                        <span>By {post.author_name}</span>
                    </>
                )}
            </div>

            {/* Content */}
            <div className="mb-12">
                <MarkdownContent content={post.content} />
            </div>

            {/* Share Buttons */}
            <div className="py-8 border-t border-b border-gray-200 mb-12">
                <ShareButtons title={post.title} url={postUrl} />
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPosts.map((relatedPost) => (
                            <Link
                                key={relatedPost.id}
                                href={`/post/${relatedPost.slug}`}
                                className="group"
                            >
                                {relatedPost.featured_image && (
                                    <div className="relative h-40 w-full bg-gray-200 rounded-lg overflow-hidden mb-3">
                                        <Image
                                            src={relatedPost.featured_image}
                                            alt={relatedPost.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {relatedPost.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {formatDate(relatedPost.published_at || relatedPost.created_at, 'short')}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </article>
    );
}
