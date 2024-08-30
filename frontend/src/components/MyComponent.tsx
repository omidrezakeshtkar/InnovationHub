"use client"; // Add this line to mark the component as a Client Component

import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { fetchApiDocs } from '../services/apiService';

const MyComponent: React.FC = () => {
    const [endpoints, setEndpoints] = useState<{ [key: string]: any }>({}); // Initialize as an empty object

    useEffect(() => {
        const loadApiDocs = async () => {
            try {
                const docs = await fetchApiDocs();
                console.log('API Docs:', docs); // Log the entire response
                setEndpoints(docs.paths || {}); // Set to an empty object if paths is undefined
            } catch (error) {
                console.error('Failed to load API docs:', error);
            }
        };

        loadApiDocs();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to Idea Exchange</h1>
            <Button variant="contained" color="primary">
                Get Started
            </Button>
            <div className="mt-4">
                <h2 className="text-2xl">API Endpoints:</h2>
                <ul>
                    {Object.keys(endpoints).length > 0 ? (
                        Object.keys(endpoints).map((endpoint) => (
                            <li key={endpoint} className="text-lg">
                                {endpoint}
                            </li>
                        ))
                    ) : (
                        <li className="text-lg">No endpoints available</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default MyComponent;