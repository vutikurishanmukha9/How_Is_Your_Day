import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { api } from '../lib/api';
import '../global.css';

// Configure notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

export default function RootLayout() {
    useEffect(() => {
        registerForPushNotifications();
    }, []);

    const registerForPushNotifications = async () => {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return;
            }

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log('Push token:', token);

            // Register token with backend
            await api.registerPushToken(token, Platform.OS as 'ios' | 'android');
        } catch (error) {
            console.error('Error registering for push notifications:', error);
        }
    };

    return (
        <QueryClientProvider client={queryClient}>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#4F46E5',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="post/[slug]"
                    options={{
                        title: 'Post',
                        presentation: 'card',
                    }}
                />
            </Stack>
            <StatusBar style="light" />
        </QueryClientProvider>
    );
}
