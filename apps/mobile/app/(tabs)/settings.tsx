import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import { useState } from 'react';
import { api } from '../../lib/api';
import { EMAIL_REGEX } from '@how-is-your-day/shared';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
    const [email, setEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);

    const handleSubscribe = async () => {
        if (!EMAIL_REGEX.test(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address');
            return;
        }

        setSubscribing(true);
        try {
            const result = await api.subscribe(email);
            if (result.success) {
                Alert.alert('Success', result.data.message);
                setEmail('');
            } else {
                Alert.alert('Error', result.error || 'Failed to subscribe');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to subscribe. Please try again.');
        } finally {
            setSubscribing(false);
        }
    };

    const openLink = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-4 space-y-4">
                {/* Newsletter Section */}
                <View className="bg-white rounded-lg shadow-md p-6">
                    <Text className="text-xl font-bold text-gray-900 mb-2">
                        Newsletter
                    </Text>
                    <Text className="text-gray-600 mb-4">
                        Subscribe to get the latest posts delivered to your inbox
                    </Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                    />
                    <TouchableOpacity
                        onPress={handleSubscribe}
                        disabled={subscribing}
                        className="bg-indigo-600 rounded-lg py-3 items-center disabled:opacity-50"
                    >
                        <Text className="text-white font-semibold">
                            {subscribing ? 'Subscribing...' : 'Subscribe'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <View className="bg-white rounded-lg shadow-md p-6">
                    <Text className="text-xl font-bold text-gray-900 mb-4">
                        About
                    </Text>
                    <Text className="text-gray-600 mb-4">
                        How Is Your Day is a personal blogging platform sharing thoughts, stories, and insights.
                    </Text>
                    <TouchableOpacity
                        onPress={() => openLink('https://howisyourday.com/about')}
                        className="flex-row items-center"
                    >
                        <Ionicons name="information-circle-outline" size={20} color="#4F46E5" />
                        <Text className="text-indigo-600 font-medium ml-2">Learn more</Text>
                    </TouchableOpacity>
                </View>

                {/* Social Links */}
                <View className="bg-white rounded-lg shadow-md p-6">
                    <Text className="text-xl font-bold text-gray-900 mb-4">
                        Connect
                    </Text>
                    <View className="space-y-3">
                        <TouchableOpacity
                            onPress={() => openLink('https://twitter.com/howisyourday')}
                            className="flex-row items-center py-2"
                        >
                            <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                            <Text className="text-gray-700 ml-3">Twitter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => openLink('https://github.com/howisyourday')}
                            className="flex-row items-center py-2"
                        >
                            <Ionicons name="logo-github" size={24} color="#333" />
                            <Text className="text-gray-700 ml-3">GitHub</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* App Info */}
                <View className="bg-white rounded-lg shadow-md p-6">
                    <Text className="text-xl font-bold text-gray-900 mb-4">
                        App Information
                    </Text>
                    <View className="space-y-2">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Version</Text>
                            <Text className="text-gray-900 font-medium">1.0.0</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Platform</Text>
                            <Text className="text-gray-900 font-medium">React Native</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View className="py-4">
                    <Text className="text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} How Is Your Day
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
