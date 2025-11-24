import { View, Text, ScrollView, Image, ActivityIndicator, Share, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import Markdown from 'react-native-markdown-display';
import { formatDate } from '@how-is-your-day/shared';
import { Ionicons } from '@expo/vector-icons';

export default function PostDetailScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['post', slug],
        queryFn: () => api.getPostBySlug(slug),
        enabled: !!slug,
    });

    const post = data?.data;

    const handleShare = async () => {
        if (!post) return;

        try {
            await Share.share({
                message: `${post.title}\n\nRead more at: ${process.env.EXPO_PUBLIC_API_URL}/post/${post.slug}`,
                title: post.title,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    if (isError || !post) {
        return (
            <View className="flex-1 justify-center items-center bg-white p-4">
                <Text className="text-red-600 text-center">Failed to load post</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: post.title,
                    headerRight: () => (
                        <TouchableOpacity onPress={handleShare} className="mr-2">
                            <Ionicons name="share-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView className="flex-1 bg-white">
                {/* Featured Image */}
                {post.featured_image && (
                    <Image
                        source={{ uri: post.featured_image }}
                        className="w-full h-64"
                        resizeMode="cover"
                    />
                )}

                <View className="p-4">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <View className="flex-row flex-wrap mb-3">
                            {post.tags.map((tag) => (
                                <View key={tag} className="bg-indigo-100 px-3 py-1 rounded-full mr-2 mb-2">
                                    <Text className="text-sm text-indigo-600 font-medium">#{tag}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Title */}
                    <Text className="text-3xl font-bold text-gray-900 mb-3">
                        {post.title}
                    </Text>

                    {/* Meta */}
                    <View className="flex-row items-center mb-6 pb-4 border-b border-gray-200">
                        <Text className="text-gray-600">
                            {formatDate(post.published_at || post.created_at, 'long')}
                        </Text>
                        {post.author_name && (
                            <>
                                <Text className="text-gray-400 mx-2">•</Text>
                                <Text className="text-gray-600">By {post.author_name}</Text>
                            </>
                        )}
                    </View>

                    {/* Content */}
                    <Markdown
                        style={{
                            body: { fontSize: 16, lineHeight: 24, color: '#374151' },
                            heading1: { fontSize: 28, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
                            heading2: { fontSize: 24, fontWeight: 'bold', marginTop: 14, marginBottom: 6 },
                            heading3: { fontSize: 20, fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
                            paragraph: { marginBottom: 12 },
                            link: { color: '#4F46E5' },
                            code_inline: { backgroundColor: '#F3F4F6', padding: 2, borderRadius: 4 },
                            code_block: { backgroundColor: '#1F2937', padding: 12, borderRadius: 8, color: '#F9FAFB' },
                            fence: { backgroundColor: '#1F2937', padding: 12, borderRadius: 8, color: '#F9FAFB' },
                        }}
                    >
                        {post.content}
                    </Markdown>
                </View>
            </ScrollView>
        </>
    );
}
