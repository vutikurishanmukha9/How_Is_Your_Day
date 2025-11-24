import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { useState } from 'react';

interface Tag {
    tag: string;
    count: number;
}

export default function ExploreScreen() {
    const router = useRouter();
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const { data: tagsData, isLoading: tagsLoading } = useQuery({
        queryKey: ['tags'],
        queryFn: () => api.getTags(),
    });

    const { data: postsData, isLoading: postsLoading } = useQuery({
        queryKey: ['posts-by-tag', selectedTag],
        queryFn: () => selectedTag ? api.getPostsByTag(selectedTag) : api.getPosts(),
        enabled: !!selectedTag,
    });

    const tags: Tag[] = tagsData?.data || [];
    const posts = postsData?.data?.data || [];

    const renderTag = ({ item }: { item: Tag }) => (
        <TouchableOpacity
            onPress={() => setSelectedTag(item.tag)}
            className={`px-4 py-2 rounded-full mr-2 mb-2 ${selectedTag === item.tag
                    ? 'bg-indigo-600'
                    : 'bg-gray-200'
                }`}
        >
            <Text
                className={`font-medium ${selectedTag === item.tag ? 'text-white' : 'text-gray-700'
                    }`}
            >
                #{item.tag} ({item.count})
            </Text>
        </TouchableOpacity>
    );

    const renderPost = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => router.push(`/post/${item.slug}`)}
            className="bg-white rounded-lg shadow-md p-4 mb-3"
        >
            <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={2}>
                {item.title}
            </Text>
            {item.excerpt && (
                <Text className="text-gray-600 text-sm" numberOfLines={2}>
                    {item.excerpt}
                </Text>
            )}
        </TouchableOpacity>
    );

    if (tagsLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Tags Section */}
            <View className="bg-white p-4 border-b border-gray-200">
                <Text className="text-lg font-bold text-gray-900 mb-3">Explore by Tags</Text>
                <FlatList
                    data={tags}
                    renderItem={renderTag}
                    keyExtractor={(item) => item.tag}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}
                />
                {selectedTag && (
                    <TouchableOpacity
                        onPress={() => setSelectedTag(null)}
                        className="mt-2"
                    >
                        <Text className="text-indigo-600 font-medium">Clear filter</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Posts Section */}
            {selectedTag && (
                <View className="flex-1 p-4">
                    {postsLoading ? (
                        <ActivityIndicator size="large" color="#4F46E5" className="mt-8" />
                    ) : (
                        <FlatList
                            data={posts}
                            renderItem={renderPost}
                            keyExtractor={(item) => item.id.toString()}
                            ListEmptyComponent={
                                <Text className="text-gray-500 text-center mt-8">
                                    No posts found for this tag
                                </Text>
                            }
                        />
                    )}
                </View>
            )}

            {!selectedTag && (
                <View className="flex-1 justify-center items-center p-4">
                    <Text className="text-gray-500 text-center">
                        Select a tag to explore posts
                    </Text>
                </View>
            )}
        </View>
    );
}
