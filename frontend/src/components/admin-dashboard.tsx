import React from 'react';
import { Home, Lightbulb, GitPullRequest, MessageSquare, Bell, Plus } from 'lucide-react';

const overviewData = [
    { title: "Total users", value: 112 },
    { title: "Total ideas", value: 15 },
    { title: "Total feedback", value: 3 },
];

const pendingApprovals = [
    {
        type: "New idea",
        title: "Allow users to sign in with Apple ID",
        description: "We'd like to allow users to sign in using their Apple ID on our web app. This would make it easier for many of our users to log in, as they're already signed into their Apple account on their device.",
        image: "/apple-logo-1.jpg"
    },
    {
        type: "New idea",
        title: "Implement dark mode across the platform",
        description: "Many users have requested a dark mode option for our platform. This would improve user experience in low-light environments and potentially reduce eye strain.",
        image: "/dark-mode-icon.jpg"
    },
    {
        type: "Feature enhancement",
        title: "Add customizable dashboard widgets",
        description: "Users want more control over their dashboard layout. We should implement draggable and resizable widgets that users can customize to their needs.",
        image: "/dashboard-icon.jpg"
    },
];

const moderationData = [
    { title: "Pending", value: 2 },
    { title: "Spam", value: 0 },
    { title: "Deleted", value: 1 },
    { title: "Flagged", value: 3 },
];

const userManagementData = [
    { title: "Users", value: 112 },
    { title: "Groups", value: 5 },
    { title: "Roles", value: 3 },
];

const systemSettingsData = [
    { title: "SSO", value: "Enabled" },
    { title: "Custom Domains", value: 3 },
    { title: "API", value: "Enabled" },
];

export function AdminDashboardComponent() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 mb-8 md:mb-0 md:mr-8">
                        <nav className="bg-white shadow-md rounded-lg p-4">
                            <ul className="space-y-2">
                                <li className="flex items-center space-x-2 text-purple-600 font-semibold">
                                    <Home size={20} />
                                    <span>Home</span>
                                </li>
                                <li className="flex items-center space-x-2 text-gray-700 hover:text-purple-600">
                                    <Lightbulb size={20} />
                                    <span>Ideas</span>
                                </li>
                                <li className="flex items-center space-x-2 text-gray-700 hover:text-purple-600">
                                    <GitPullRequest size={20} />
                                    <span>Roadmap</span>
                                </li>
                                <li className="flex items-center space-x-2 text-gray-700 hover:text-purple-600">
                                    <MessageSquare size={20} />
                                    <span>Feedback</span>
                                </li>
                                <li className="flex items-center space-x-2 text-gray-700 hover:text-purple-600">
                                    <Bell size={20} />
                                    <span>Announcements</span>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Main content */}
                    <div className="flex-grow">
                        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

                        {/* Overview */}
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {overviewData.map((item, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{item.title}</h3>
                                    <p className="text-3xl font-bold text-purple-600">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Pending approvals */}
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending approvals</h2>
                        <div className="space-y-4 mb-8">
                            {pendingApprovals.map((item, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-md flex items-start">
                                    <div className="flex-grow">
                                        <p className="text-sm text-gray-500 mb-1">{item.type}</p>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                                        <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                                        <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300">
                                            Review
                                        </button>
                                    </div>
                                    <img src={item.image} alt="Idea icon" className="w-24 h-24 object-cover rounded-lg ml-4" />
                                </div>
                            ))}
                        </div>

                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center mb-8">
                            <Plus size={20} className="mr-2" />
                            New Idea
                        </button>

                        {/* Moderation */}
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Moderation</h2>
                        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
                            <ul>
                                {moderationData.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                        <span className="text-gray-700">{item.title}</span>
                                        <span className="text-purple-600 font-semibold">{item.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* User Management */}
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Management</h2>
                        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
                            <ul>
                                {userManagementData.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                        <span className="text-gray-700">{item.title}</span>
                                        <span className="text-purple-600 font-semibold">{item.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* System Settings */}
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">System Settings</h2>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <ul>
                                {systemSettingsData.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                        <span className="text-gray-700">{item.title}</span>
                                        <span className="text-purple-600 font-semibold">{item.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}