import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import branding from '../branding.json';

export function Error403Page() {
    const primaryColor = branding.primaryColor || 'var(--primary)';
    const secondaryColor = branding.secondaryColor || 'var(--secondary)';

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <ShieldOff className="mx-auto h-12 w-12" style={{color: primaryColor}} />
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                    403 - Forbidden
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Sorry, you don't have access to this page.
                </p>
                <div className="mt-5">
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white"
                        style={{backgroundColor: primaryColor, ':hover': {filter: 'brightness(90%)'}}}
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        </div>
    );
}