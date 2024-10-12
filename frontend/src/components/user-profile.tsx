import React, { useEffect, useState } from "react";
import { ArrowUp, Briefcase, Users, Mail, Calendar, Award, Star } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import branding from "../branding.json";

interface User {
	_id: string;
	name: string;
	email: string;
	role: string;
	department: string;
	permissions: string[];
	points: number;
	badges: string[];
	createdAt: string;
	updatedAt: string;
}

interface Idea {
	id: string;
	title: string;
	description: string;
	createdAt: string;
	upvotes: number;
}

export function UserProfileComponent() {
	const primaryColor = branding.primaryColor || "var(--primary)";
	const [user, setUser] = useState<User | null>(null);
	// const [ideas, setIdeas] = useState<Idea[]>([]);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const accessToken = localStorage.getItem("accessToken");
				const response = await axios.get(
					"http://localhost:3000/api/user/profile",
					{
						headers: { Authorization: `Bearer ${accessToken}` },
					}
				);
				setUser(response.data);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		// const fetchUserIdeas = async () => {
		// 	try {
		// 		const token = localStorage.getItem("token");
		// 		const response = await axios.get(
		// 			"http://localhost:3000/api/ideas/user",
		// 			{
		// 				headers: { Authorization: `Bearer ${token}` },
		// 			}
		// 		);
		// 		setIdeas(response.data);
		// 	} catch (error) {
		// 		console.error("Error fetching user ideas:", error);
		// 	}
		// };

		fetchUserData();
		// fetchUserIdeas();
	}, []);

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-white shadow-md rounded-lg p-6 mb-8">
					<div className="flex items-start">
						<img
							src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
							alt={user.name}
							className="w-24 h-24 rounded-full mr-6"
						/>
						<div className="flex-grow">
							<h1 className="text-3xl font-bold text-gray-800 mb-2">
								{user.name}
							</h1>
							<div className="flex items-center mb-2">
								<Mail size={18} className="text-blue-500 mr-2" />
								<span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
									{user.email}
								</span>
							</div>
							<div className="flex items-center mb-2">
								<Briefcase size={18} className="text-indigo-500 mr-2" />
								<span className="bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
									{user.role}
								</span>
							</div>
							<div className="flex items-center mb-2">
								<Users size={18} className="text-green-500 mr-2" />
								<span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
									{user.department}
								</span>
							</div>
							<div className="flex items-center mb-2">
								<Star size={18} className="text-yellow-500 mr-2" />
								<span className="bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
									Points: {user.points}
								</span>
							</div>
							<div className="flex items-center mb-2">
								<Award size={18} className="text-purple-500 mr-2" />
								<span className="bg-purple-100 text-purple-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
									Badges: {user.badges.length > 0 ? user.badges.join(", ") : "No badges yet"}
								</span>
							</div>
							<div className="flex items-center mb-2">
								<Calendar size={18} className="text-red-500 mr-2" />
								<span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
									Member since: {new Date(user.createdAt).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="md:col-span-2">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">My Ideas</h2>
						<div className="space-y-4">
							{/* {ideas.map((idea) => (
								<div
									key={idea.id}
									className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
								>
									<div>
										<h3 className="text-lg font-semibold text-gray-800">
											{idea.title}
										</h3>
										<p className="text-gray-600 text-sm">
											{new Date(idea.createdAt).toLocaleDateString()}
										</p>
									</div>
									<div
										className="flex items-center"
										style={{ color: primaryColor }}
									>
										<ArrowUp size={20} />
										<span className="ml-1 font-semibold">
											{idea.upvotes} votes
										</span>
									</div>
								</div>
							))} */}
						</div>
					</div>

					<div>
						<h2 className="text-2xl font-bold text-gray-800 mb-4">
							Quick Links
						</h2>
						<div className="bg-white shadow-md rounded-lg p-4">
							<ul className="space-y-2">
								<li>
									<Link
										to="/ideas/new"
										className="hover:underline"
										style={{ color: primaryColor }}
									>
										Submit a new idea
									</Link>
								</li>
								<li>
									<Link
										to="/ideas"
										className="hover:underline"
										style={{ color: primaryColor }}
									>
										Browse all ideas
									</Link>
								</li>
								<li>
									<Link
										to="/settings"
										className="hover:underline"
										style={{ color: primaryColor }}
									>
										Account settings
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
