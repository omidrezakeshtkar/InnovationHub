import React from 'react';

export function PrivacyPolicyComponent() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Privacy Policy</h1>
                <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                    <p className="mb-4">
                        This Privacy Policy outlines how IdeaExchange collects, uses, maintains, and discloses information collected from users of our internal platform.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information Collection</h2>
                    <p className="mb-4">
                        We collect personal information that you voluntarily provide when using our platform, such as your name, email address, and any ideas or comments you submit.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Use of Information</h2>
                    <p className="mb-4">
                        The information we collect is used to improve our internal processes, respond to user inquiries, and enhance the user experience on our platform.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Protection</h2>
                    <p className="mb-4">
                        We implement appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to This Privacy Policy</h2>
                    <p className="mb-4">
                        IdeaExchange has the discretion to update this privacy policy at any time. We encourage users to frequently check this page for any changes.
                    </p>
                </div>
            </div>
        </div>
    );
}