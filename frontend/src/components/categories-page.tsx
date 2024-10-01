import React, { useState } from 'react';
import { Search, Folder } from 'lucide-react';
import { Link } from 'react-router-dom';

const featuredCategories = [
    {
        name: "User Experience",
        description: "Ideas related to improving the overall user experience of our product.",
        image: "/placeholder-ux-image.jpg"
    },
    {
        name: "Performance Optimization",
        description: "Suggestions for improving the speed and efficiency of our application.",
        image: "/placeholder-performance-image.jpg"
    },
    {
        name: "New Features",
        description: "Innovative ideas for new features that could enhance our product.",
        image: "/placeholder-features-image.jpg"
    }
];

const allCategories = [
    { name: "All categories", count: 230 },
    { name: "User Interface", count: 45 },
    { name: "Backend", count: 38 },
    { name: "Mobile App", count: 27 },
    { name: "API", count: 23 },
    { name: "Integrations", count: 19 },
    { name: "Automation", count: 17 },
    { name: "Security", count: 15 },
    { name: "Enterprise", count: 12 },
    { name: "Education", count: 11 },
    { name: "Analytics", count: 10 },
    { name: "Accessibility", count: 8 },
];

export function CategoriesPageComponent() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Categories</h1>
                <p className="text-xl text-gray-600 mb-8">Explore ideas by category or suggest new categories for organization</p>
                
                <div className="mb-8 relative">
                    <input
                        type="text"
                        placeholder="Search categories"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Categories</h2>
                        <div className="space-y-6">
                            {featuredCategories.map((category, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <img src={category.image} alt={category.name} className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
                                        <p className="text-gray-600 mb-4">{category.description}</p>
                                        <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300">
                                            Explore category
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-4">All Categories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {allCategories.map((category, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Folder className="text-purple-600 mr-3" size={24} />
                                        <span className="font-semibold text-gray-800">{category.name}</span>
                                    </div>
                                    <span className="text-gray-600">{category.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Links</h2>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <ul className="space-y-2">
                                <li><Link to="/ideas/new" className="text-purple-600 hover:underline">Submit a new idea</Link></li>
                                <li><Link to="/categories/popular" className="text-purple-600 hover:underline">View popular categories</Link></li>
                                <li><Link to="/categories/suggest" className="text-purple-600 hover:underline">Suggest a new category</Link></li>
                                <li><Link to="/faq" className="text-purple-600 hover:underline">FAQ</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}