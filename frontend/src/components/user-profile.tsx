import React, { useEffect, useState } from "react";
import {
	ArrowUp,
	Briefcase,
	Users,
	Mail,
	Calendar,
	Award,
	Star,
	Shield,
	PlusCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
	_id: string;
	title: string;
	description: string;
	author: string;
	coAuthors: string[];
	status: string;
	category: {
		_id: string;
		name: string;
	};
	department: string;
	votes: number;
	tags: string[];
	currentVersion: number;
	createdAt: string;
	updatedAt: string;
}

export function UserProfileComponent() {
	const primaryColor = branding.primaryColor || "var(--primary)";
	const [user, setUser] = useState<User | null>(null);
	const [ideas, setIdeas] = useState<Idea[]>([]);
	const navigate = useNavigate();

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
				localStorage.removeItem("accessToken");
				navigate("/");
			}
		};

		const fetchUserIdeas = async () => {
			try {
				const accessToken = localStorage.getItem("accessToken");
				const response = await axios.get(
					"http://localhost:3000/api/ideas/user",
					{
						headers: { Authorization: `Bearer ${accessToken}` },
					}
				);
				setIdeas(response.data);
			} catch (error) {
				console.error("Error fetching user ideas:", error);
			}
		};

		fetchUserData();
		fetchUserIdeas();
	}, [navigate]);

	if (!user) {
		return <div>Loading...</div>;
	}

	const isAdminOrOwner = user.role === "admin" || user.role === "owner";

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-white shadow-md rounded-lg p-6 mb-8">
					<div className="flex flex-col items-center mb-6">
						<img
							src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
							alt={user.name}
							className="w-24 h-24 rounded-full mb-4"
						/>
						<h1 className="text-3xl font-bold text-gray-800 mb-2">
							{user.name}
						</h1>
						{isAdminOrOwner && (
							<Link
								to="/admin"
								className="flex items-center text-purple-600 hover:text-purple-800 transition-colors duration-200 mt-2"
							>
								<Shield size={20} className="mr-1" />
								Admin Dashboard
							</Link>
						)}
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						<div className="bg-blue-100 rounded-lg p-4 flex flex-col items-center">
							<Mail size={24} className="text-blue-500 mb-2" />
							<span className="text-blue-800 text-sm font-medium text-center">
								{user.email}
							</span>
						</div>
						<div className="bg-indigo-100 rounded-lg p-4 flex flex-col items-center">
							<Briefcase size={24} className="text-indigo-500 mb-2" />
							<span className="text-indigo-800 text-sm font-medium text-center">
								{user.role}
							</span>
						</div>
						<div className="bg-green-100 rounded-lg p-4 flex flex-col items-center">
							<Users size={24} className="text-green-500 mb-2" />
							<span className="text-green-800 text-sm font-medium text-center">
								{user.department}
							</span>
						</div>
						<div className="bg-yellow-100 rounded-lg p-4 flex flex-col items-center">
							<Star size={24} className="text-yellow-500 mb-2" />
							<span className="text-yellow-800 text-sm font-medium text-center">
								Points: {user.points}
							</span>
						</div>
						<div className="bg-purple-100 rounded-lg p-4 flex flex-col items-center">
							<Award size={24} className="text-purple-500 mb-2" />
							<span className="text-purple-800 text-sm font-medium text-center">
								Badges:{" "}
								{user.badges.length > 0
									? user.badges.join(", ")
									: "No badges yet"}
							</span>
						</div>
						<div className="bg-red-100 rounded-lg p-4 flex flex-col items-center">
							<Calendar size={24} className="text-red-500 mb-2" />
							<span className="text-red-800 text-sm font-medium text-center">
								Member since: {new Date(user.createdAt).toLocaleDateString()}
							</span>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="md:col-span-2">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">My Ideas</h2>
						{ideas.length > 0 ? (
							<div className="space-y-4">
								{ideas.map((idea) => (
									<div
										key={idea._id}
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
												{idea.votes} votes
											</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="bg-white shadow-md rounded-lg p-8 text-center">
								<PlusCircle
									size={48}
									className="mx-auto mb-4"
									style={{ color: primaryColor }}
								/>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">
									No Ideas Yet
								</h3>
								<p className="text-gray-600 mb-4">
									You haven't submitted any ideas yet. Why not start now?
								</p>
								<Link
									to="/ideas/new"
									className="inline-block px-6 py-2 rounded-md text-white transition duration-300 hover:opacity-90"
									style={{ backgroundColor: primaryColor }}
								>
									Submit Your First Idea
								</Link>
							</div>
						)}
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
