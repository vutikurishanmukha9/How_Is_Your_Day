'use client';

import { useState } from 'react';
import { EMAIL_REGEX } from '@how-is-your-day/shared';

export default function SubscribeForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate email
        if (!EMAIL_REGEX.test(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setStatus('success');
                setMessage(data.data.message);
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to subscribe');
            }
        } catch (error) {
            setStatus('error');
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Subscribe to Newsletter</h3>
            <p className="mb-6 text-indigo-100">
                Get the latest posts delivered right to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                    disabled={status === 'loading'}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>

            {/* Status Messages */}
            {message && (
                <div
                    className={`mt-4 p-3 rounded-md ${status === 'success'
                            ? 'bg-green-500 bg-opacity-20 border border-green-300'
                            : 'bg-red-500 bg-opacity-20 border border-red-300'
                        }`}
                >
                    <p className="text-sm">{message}</p>
                </div>
            )}
        </div>
    );
}
