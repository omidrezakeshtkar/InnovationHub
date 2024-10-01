import React from 'react';
import { Lightbulb, Users, Zap, Lock } from 'lucide-react';

export function AboutPageComponent() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">About IdeaExchange</h1>
                
                <section className="mb-12">
                    <p className="text-xl text-gray-600 mb-6">
                        IdeaExchange is an internal platform designed to foster innovation and collaboration within our company. We believe that great ideas can come from any employee, and when shared, they have the power to transform our organization.
                    </p>
                    <p className="text-xl text-gray-600">
                        Our mission is to create an environment where ideas flourish, collaboration thrives, and innovation drives our company forward.
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">What We Offer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-start">
                            <Lightbulb className="text-purple-600 mr-4" size={24} />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Idea Sharing</h3>
                                <p className="text-gray-600">Share your innovative ideas with colleagues and get valuable feedback.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Users className="text-purple-600 mr-4" size={24} />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Team Collaboration</h3>
                                <p className="text-gray-600">Connect with team members across departments to bring ideas to life.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Zap className="text-purple-600 mr-4" size={24} />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Rapid Prototyping</h3>
                                <p className="text-gray-600">Quickly develop and iterate on ideas with our internal resources.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Lock className="text-purple-600 mr-4" size={24} />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Environment</h3>
                                <p className="text-gray-600">Share ideas in a protected, internal-only platform.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Our Vision</h2>
                    <p className="text-gray-600 mb-4">
                        IdeaExchange was created to harness the collective creativity and expertise of our employees. We believe that by providing a dedicated space for idea sharing and collaboration, we can drive innovation from within and maintain our competitive edge in the industry.
                    </p>
                    <p className="text-gray-600">
                        Our platform is designed to break down silos, encourage cross-departmental collaboration, and create a culture of continuous improvement and innovation.
                    </p>
                </section>

                <section>
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Get Involved</h2>
                    <p className="text-gray-600 mb-6">
                        Every employee has the potential to contribute game-changing ideas. We encourage you to explore the platform, share your thoughts, and collaborate with your colleagues. Your next idea could be the one that propels our company to new heights.
                    </p>
                    <div className="text-center">
                        <button className="bg-purple-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-purple-700 transition duration-300">
                            Start Sharing Ideas
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}