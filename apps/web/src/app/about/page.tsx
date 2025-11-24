import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'About | How Is Your Day',
    description: 'Learn more about How Is Your Day and the person behind the blog',
};

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    About This Blog
                </h1>
                <p className="text-xl text-gray-600">
                    A personal space for sharing thoughts and stories
                </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
                <h2>Welcome!</h2>
                <p>
                    <strong>How Is Your Day</strong> is a personal blogging platform where I share my thoughts, experiences, and insights about life, technology, and everything in between.
                </p>

                <h2>What You'll Find Here</h2>
                <p>
                    This blog is a collection of:
                </p>
                <ul>
                    <li><strong>Personal Stories</strong> - Real experiences and reflections from my daily life</li>
                    <li><strong>Tech Insights</strong> - Thoughts on technology, programming, and digital trends</li>
                    <li><strong>Creative Ideas</strong> - Explorations in creativity, design, and innovation</li>
                    <li><strong>Life Lessons</strong> - Learnings from successes, failures, and everything in between</li>
                </ul>

                <h2>Why I Write</h2>
                <p>
                    Writing helps me process my thoughts, connect with others, and document my journey. This blog is both a personal archive and a way to share what I've learned with anyone who might find it useful.
                </p>

                <h2>Get in Touch</h2>
                <p>
                    I'd love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to <a href="/contact" className="text-indigo-600 hover:text-indigo-800">reach out</a>.
                </p>

                <p>
                    You can also subscribe to the newsletter to get new posts delivered straight to your inbox.
                </p>
            </div>

            {/* CTA Section */}
            <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white text-center">
                <h2 className="text-2xl font-bold mb-4">Stay Connected</h2>
                <p className="mb-6 text-indigo-100">
                    Subscribe to get the latest posts and updates
                </p>
                <a
                    href="/#posts"
                    className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                    Read Latest Posts
                </a>
            </div>
        </div>
    );
}
