import React from 'react';
import { ArrowUp, MessageSquare, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data - replace with actual data fetching in a real application
const user = {
    name: "Amelia Watson",
    role: "UX Designer at Acme Inc. San Francisco, CA",
    avatar: "/placeholder-avatar.jpg",
    followers: 8000,
    following: 1000,
    ideas: [
        { title: "Dark mode", timestamp: "12 months ago", votes: 6000 },
        { title: "Metrics in dashboards", timestamp: "12 months ago", votes: 6000 },
        { title: "Emoji reactions", timestamp: "12 months ago", votes: 6000 },
        { title: "Kanban boards", timestamp: "12 months ago", votes: 6000 },
        { title: "Custom fields in tables", timestamp: "12 months ago", votes: 6000 },
    ],
    activities: [
        { title: "UX Designer", ideas: 1200, votes: 3000, description: "UX Designer at Acme Inc. San Francisco, CA" },
        { title: "UX Designer", ideas: 1200, votes: 3000, description: "UX Designer at Acme Inc. San Francisco, CA" },
        { title: "UX Designer", ideas: 1200, votes: 3000, description: "UX Designer at Acme Inc. San Francisco, CA" },
    ]
};

export function UserProfileComponent() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <div className="flex items-start">
                        <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mr-6" />
                        <div className="flex-grow">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
                            <p className="text-gray-600 mb-4">{user.role}</p>
                            <div className="flex space-x-4 mb-4">
                                <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300">
                                    Follow
                                </button>
                                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300">
                                    Message
                                </button>
                            </div>
                            <div className="text-gray-600">
                                <span className="mr-4">{user.followers.toLocaleString()} followers</span>
                                <span>Followed by {user.following.toLocaleString()} people</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ideas</h2>
                        <div className="space-y-4">
                            {user.ideas.map((idea, index) => (
                                <div key={index} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{idea.title}</h3>
                                        <p className="text-gray-600 text-sm">{idea.timestamp}</p>
                                    </div>
                                    <div className="flex items-center text-purple-600">
                                        <ArrowUp size={20} />
                                        <span className="ml-1 font-semibold">{idea.votes.toLocaleString()} votes</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Activity</h2>
                        <div className="space-y-4">
                            {user.activities.map((activity, index) => (
                                <div key={index} className="bg-white shadow-md rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{activity.title}</h3>
                                    <p className="text-gray-600 mb-2">
                                        {activity.ideas.toLocaleString()} ideas • {activity.votes.toLocaleString()} votes
                                    </p>
                                    <p className="text-gray-600 text-sm">{activity.description}</p>
                                    <Link to="#" className="text-purple-600 hover:text-purple-800 flex items-center mt-2">
                                        View <ChevronRight size={16} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}