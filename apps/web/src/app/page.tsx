import { supabaseServer } from '@/lib/supabase/server';
import PostGrid from '@/components/PostGrid';
import SubscribeForm from '@/components/SubscribeForm';
import Link from 'next/link';
import { Post } from '@how-is-your-day/shared';

async function getRecentPosts(): Promise<Post[]> {
    const { data, error } = await supabaseServer
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6);

    if (error) {
        console.error('Failed to fetch posts:', error);
        return [];
    }

    return data || [];
}

export default async function Home() {
    const posts = await getRecentPosts();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        How Is Your Day?
                    </h1>
                    <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                        A personal space for sharing thoughts, stories, and insights about life, technology, and everything in between.
                    </p>
                    <Link
                        href="#posts"
                        className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Read Latest Posts
                    </Link>
                </div>
            </section>

            {/* Recent Posts Section */}
            <section id="posts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Recent Posts</h2>
                    {posts.length > 0 && (
                        <Link
                            href="/?page=2"
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            View all →
                        </Link>
                    )}
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">
                            No posts yet. Check back soon for new content!
                        </p>
                    </div>
                ) : (
                    <PostGrid posts={posts} />
                )}
            </section>

            {/* Newsletter Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <SubscribeForm />
            </section>

            {/* Features Section */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        What You'll Find Here
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Stories</h3>
                            <p className="text-gray-600">
                                Authentic experiences and reflections from everyday life.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Insights & Ideas</h3>
                            <p className="text-gray-600">
                                Thoughtful perspectives on technology, creativity, and growth.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
                            <p className="text-gray-600">
                                Join a growing community of readers and thinkers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
