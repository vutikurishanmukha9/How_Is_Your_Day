'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';
import MarkdownContent from '@/components/MarkdownContent';

interface PostFormData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string;
    tags: string;
    status: 'draft' | 'published';
    published_at: string;
}

export default function PostEditorPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params?.id as string | undefined;
    const isEditing = !!postId;

    const [formData, setFormData] = useState<PostFormData>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '',
        tags: '',
        status: 'draft',
        published_at: '',
    });
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(isEditing);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        if (isEditing) {
            fetchPost(token, postId);
        }
    }, [isEditing, postId, router]);

    const fetchPost = async (token: string, id: string) => {
        try {
            const response = await fetch(`/api/admin/posts?page=1&limit=100`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const post = data.data.data.find((p: any) => p.id === parseInt(id));

                if (post) {
                    setFormData({
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt || '',
                        content: post.content,
                        featured_image: post.featured_image || '',
                        tags: post.tags?.join(', ') || '',
                        status: post.status,
                        published_at: post.published_at || '',
                    });
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch post:', error);
            setLoading(false);
        }
    };

    const handleSave = async (status: 'draft' | 'published') => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        if (!formData.title || !formData.content) {
            alert('Title and content are required');
            return;
        }

        setSaving(true);

        try {
            const payload = {
                ...formData,
                status,
                tags: formData.tags
                    ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
                    : null,
                published_at: status === 'published' && !formData.published_at
                    ? new Date().toISOString()
                    : formData.published_at || null,
            };

            const url = isEditing
                ? `/api/admin/posts/${postId}`
                : '/api/admin/posts';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                alert(`Post ${isEditing ? 'updated' : 'created'} successfully!`);
                router.push('/admin/posts');
            } else {
                alert('Failed to save post: ' + data.error);
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save post');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isEditing ? 'Edit Post' : 'New Post'}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/posts"
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            onClick={() => handleSave('draft')}
                            disabled={saving}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            Save Draft
                        </button>
                        <button
                            onClick={() => handleSave('published')}
                            disabled={saving}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Publish'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                placeholder="Enter post title"
                            />
                        </div>

                        {/* Slug */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slug (optional)
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                placeholder="auto-generated-from-title"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Leave empty to auto-generate from title
                            </p>
                        </div>

                        {/* Excerpt */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Excerpt
                            </label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                                placeholder="Brief summary of the post"
                            />
                        </div>

                        {/* Content */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Content * (Markdown)
                                </label>
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                    {showPreview ? 'Edit' : 'Preview'}
                                </button>
                            </div>

                            {showPreview ? (
                                <div className="border border-gray-300 rounded-md p-4 min-h-[400px] bg-gray-50">
                                    <MarkdownContent content={formData.content} />
                                </div>
                            ) : (
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={20}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none font-mono text-sm"
                                    placeholder="Write your post content in Markdown..."
                                />
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Featured Image */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <ImageUpload
                                onUpload={(url) => setFormData({ ...formData, featured_image: url })}
                            />
                            {formData.featured_image && (
                                <div className="mt-4">
                                    <img
                                        src={formData.featured_image}
                                        alt="Featured"
                                        className="w-full rounded"
                                    />
                                    <button
                                        onClick={() => setFormData({ ...formData, featured_image: '' })}
                                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                                    >
                                        Remove image
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                placeholder="react, nextjs, typescript"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Separate tags with commas
                            </p>
                        </div>

                        {/* Publish Date */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Publish Date
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ''}
                                onChange={(e) => setFormData({ ...formData, published_at: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Leave empty to use current time when publishing
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
