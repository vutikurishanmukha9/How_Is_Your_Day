import { supabaseServer } from '@/lib/supabase/server';
import PostGrid from '@/components/PostGrid';
import Pagination from '@/components/Pagination';
import { notFound } from 'next/navigation';
import { Post } from '@how-is-your-day/shared';
import { PAGINATION } from '@how-is-your-day/shared';
import { Metadata } from 'next';

interface PageProps {
    params: { tag: string };
    searchParams: { page?: string };
}

async function getPostsByTag(tag: string, page: number) {
    const limit = PAGINATION.DEFAULT_LIMIT;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabaseServer
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .contains('tags', [tag])
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Failed to fetch posts:', error);
        return { posts: [], total: 0 };
    }

    return { posts: data || [], total: count || 0 };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return {
        title: `Posts tagged "${params.tag}" | How Is Your Day`,
        description: `Browse all posts tagged with ${params.tag}`,
    };
}

export default async function TagPage({ params, searchParams }: PageProps) {
    const tag = decodeURIComponent(params.tag);
    const page = parseInt(searchParams.page || '1');

    const { posts, total } = await getPostsByTag(tag, page);

    if (posts.length === 0 && page === 1) {
        notFound();
    }

    const totalPages = Math.ceil(total / PAGINATION.DEFAULT_LIMIT);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Posts tagged <span className="text-indigo-600">#{tag}</span>
                </h1>
                <p className="text-xl text-gray-600">
                    {total} {total === 1 ? 'post' : 'posts'} found
                </p>
            </div>

            {/* Posts Grid */}
            <PostGrid posts={posts} />

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    basePath={`/tags/${params.tag}`}
                />
            )}
        </div>
    );
}
