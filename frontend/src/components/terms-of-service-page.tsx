import React from 'react';
import branding from '../branding.json';

export function TermsOfServiceComponent() {
    const primaryColor = branding.primaryColor || 'var(--primary)';
    const secondaryColor = branding.secondaryColor || 'var(--secondary)';

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Terms of Service</h1>
                <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                    <p className="mb-4">
                        Welcome to IdeaExchange. By accessing this platform, you agree to comply with and be bound by the following terms and conditions of use.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Use of the Platform</h2>
                    <p className="mb-4">
                        IdeaExchange is an internal platform for company use only. You agree to use this platform for its intended purpose and in compliance with all applicable laws and regulations.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Intellectual Property</h2>
                    <p className="mb-4">
                        All content and ideas shared on this platform remain the property of the company. Users agree not to disclose or use any information obtained through this platform for personal gain or outside the company.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Conduct</h2>
                    <p className="mb-4">
                        Users are expected to behave professionally and respectfully when using the platform. Any form of harassment, discrimination, or inappropriate behavior will not be tolerated.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modifications to Terms</h2>
                    <p className="mb-4">
                        IdeaExchange reserves the right to modify these terms at any time. Users will be notified of any changes and continued use of the platform constitutes acceptance of the modified terms.
                    </p>
                </div>
            </div>
        </div>
    );
}