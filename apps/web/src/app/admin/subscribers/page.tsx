'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Subscriber {
    id: number;
    email: string;
    confirmed: boolean;
    subscribed_at: string;
}

export default function AdminSubscribersPage() {
    const router = useRouter();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        fetchSubscribers(token);
    }, [router]);

    const fetchSubscribers = async (token: string) => {
        try {
            const response = await fetch('/api/admin/subscribers', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setSubscribers(data.data || []);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch subscribers:', error);
            setLoading(false);
        }
    };

    const exportCSV = () => {
        const csv = [
            ['Email', 'Confirmed', 'Subscribed At'],
            ...subscribers.map(s => [
                s.email,
                s.confirmed ? 'Yes' : 'No',
                new Date(s.subscribed_at).toLocaleDateString(),
            ]),
        ]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const confirmedCount = subscribers.filter(s => s.confirmed).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
                        <p className="text-gray-600 mt-1">
                            {confirmedCount} confirmed out of {subscribers.length} total
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/admin"
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            ← Dashboard
                        </Link>
                        <button
                            onClick={exportCSV}
                            disabled={subscribers.length === 0}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Subscribers Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : subscribers.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No subscribers yet</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Subscribed Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {subscribers.map((subscriber) => (
                                    <tr key={subscriber.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {subscriber.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${subscriber.confirmed
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                            >
                                                {subscriber.confirmed ? 'Confirmed' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(subscriber.subscribed_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
