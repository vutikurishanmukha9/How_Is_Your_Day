import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { Post } from '@how-is-your-day/shared';
import { formatDate } from '@how-is-your-day/shared';
import { useState } from 'react';

export default function HomeScreen() {
    const router = useRouter();
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['posts', page],
        queryFn: () => api.getPosts(page, 10),
    });

    const posts: Post[] = data?.data?.data || [];

    const renderPost = ({ item }: { item: Post }) => (
        <TouchableOpacity
            onPress={() => router.push(`/post/${item.slug}`)}
            className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
        >
            {item.featured_image && (
                <Image
                    source={{ uri: item.featured_image }}
                    className="w-full h-48"
                    resizeMode="cover"
                />
            )}
            <View className="p-4">
                {item.tags && item.tags.length > 0 && (
                    <View className="flex-row flex-wrap mb-2">
                        {item.tags.slice(0, 3).map((tag) => (
                            <View key={tag} className="bg-indigo-100 px-2 py-1 rounded mr-2 mb-1">
                                <Text className="text-xs text-indigo-600 font-medium">#{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
                <Text className="text-xl font-bold text-gray-900 mb-2" numberOfLines={2}>
                    {item.title}
                </Text>
                {item.excerpt && (
                    <Text className="text-gray-600 mb-2" numberOfLines={3}>
                        {item.excerpt}
                    </Text>
                )}
                <Text className="text-sm text-gray-500">
                    {formatDate(item.published_at || item.created_at, 'long')}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    if (isError) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50 p-4">
                <Text className="text-red-600 text-center mb-4">Failed to load posts</Text>
                <TouchableOpacity
                    onPress={() => refetch()}
                    className="bg-indigo-600 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-semibold">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 16 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={refetch}
                        tintColor="#4F46E5"
                    />
                }
                ListEmptyComponent={
                    <View className="py-12">
                        <Text className="text-gray-500 text-center text-lg">
                            No posts found
                        </Text>
                    </View>
                }
            />
        </View>
    );
}
