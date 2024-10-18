import React, { useState, useEffect, useRef } from "react";
import { Search, Lightbulb } from "lucide-react";
import branding from "../branding.json";
import { useNavigate } from "react-router-dom";
import { CreateIdeaModal } from "./Modals/ideas/create.modal";
import { CategorySidebar } from "./Modals/ideas/category.modal";

type Idea = {
	_id: string;
	title: string;
	description: string;
	author: {
		_id: string;
		name: string;
	};
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
	__v: number;
	userVotes: {
		userId: string;
		vote: string;
		_id: string;
	}[];
	devotes: number;
	netVotes: number;
};

type NewIdea = {
	title: string;
	description: string;
	categoryId: string;
	tags: string[];
};

const recentIdeas = [
	{
		title: "Add a shortcut to create a new task from anywhere in the app",
		days: 2,
		votes: 8,
	},
	{
		title: "Add a shortcut to create a new task from anywhere in the app",
		days: 3,
		votes: 4,
	},
	{
		title: "Add a shortcut to create a new task from anywhere in the app",
		days: 4,
		votes: 6,
	},
	{
		title: "Add a shortcut to create a new task from anywhere in the app",
		days: 5,
		votes: 10,
	},
];

interface IdeasPageComponentProps {
	showNotification: (
		message: string,
		type: "success" | "error" | "info"
	) => void;
}

export const IdeasPageComponent: React.FC<IdeasPageComponentProps> = ({
	showNotification,
}) => {
	const primaryColor = branding.primaryColor || "var(--primary)";
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [featuredIdeas, setFeaturedIdeas] = useState<Idea[]>([]);
	const [offset, setOffset] = useState<number>(0);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [showModal, setShowModal] = useState<boolean>(false);
	const limit = 10;
	const hasFetchedIdeas = useRef<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchIdeas = async () => {
			if (hasFetchedIdeas.current) return;
			try {
				const response = await fetch(
					`http://localhost:3000/api/ideas?limit=${limit}&offset=${offset}`
				);
				const data = await response.json();
				if (data.ideas.length < limit) {
					setHasMore(false);
				} else {
					setHasMore(true);
				}
				setFeaturedIdeas(data.ideas);
				hasFetchedIdeas.current = true;
			} catch {
				showNotification("Error fetching ideas", "error");
			}
		};

		fetchIdeas();
	}, [offset, showNotification]);

	const handleCreateIdea = async (newIdea: NewIdea) => {
		const accessToken = localStorage.getItem("accessToken");
		if (!accessToken) {
			showNotification("User not authenticated", "error");
			return;
		}

		try {
			const response = await fetch("http://localhost:3000/api/ideas/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(newIdea),
			});
			const data = await response.json();
			if (response.ok) {
				setOffset(0);
				hasFetchedIdeas.current = false;
				showNotification(
					"Idea created successfully and is pending approval",
					"success"
				);
			} else {
				showNotification(`Error creating idea: ${data.message}`, "error");
			}
		} catch {
			showNotification("Error creating idea", "error");
		}
	};

	const accessToken = localStorage.getItem("accessToken");
	const refreshToken = localStorage.getItem("refreshToken");

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-4xl font-bold text-gray-800 mb-6">
					Welcome to Ideas Exchange
				</h1>
				<p className="text-xl text-gray-600 mb-8">
					Share your ideas and vote on others. Help us shape the future of our
					product
				</p>

				<div className="mb-8 relative">
					<input
						type="text"
						placeholder="Search for ideas"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
						style={{
							borderColor: primaryColor,
							boxShadow: `0 0 0 2px ${primaryColor}30`,
						}}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<Search
						className="absolute right-3 top-2.5 text-gray-400"
						size={20}
					/>
				</div>

				{accessToken && refreshToken && (
					<button
						className="mb-8 text-white px-4 py-2 rounded-md"
						style={{ backgroundColor: primaryColor }}
						onClick={() => setShowModal(true)}
					>
						Create Idea
					</button>
				)}

				<CreateIdeaModal
					isOpen={showModal}
					onClose={() => setShowModal(false)}
					onCreateIdea={handleCreateIdea}
					showNotification={showNotification}
				/>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">Featured</h2>
						<div className="space-y-6">
							{featuredIdeas.map((idea) => (
								<div
									key={idea._id}
									className="bg-white rounded-lg shadow-md overflow-hidden"
								>
									<div className="p-6">
										<h3 className="text-xl font-semibold text-gray-800 mb-2">
											{idea.title}
										</h3>
										<p className="text-gray-600 mb-4">{idea.description}</p>
										<button
											className="text-white px-4 py-2 rounded-md transition duration-300"
											style={{
												backgroundColor: primaryColor,
												filter: "brightness(90%)",
											}}
											onClick={() => navigate(`/ideas/${idea._id}`)}
										>
											View details
										</button>
									</div>
								</div>
							))}
						</div>

						{hasMore && (
							<button
								className="w-full bg-gray-200 text-gray-700 py-2 rounded-md mt-6 hover:bg-gray-300 transition duration-300"
								onClick={() => setOffset((prevOffset) => prevOffset + limit)}
							>
								Load more
							</button>
						)}

						<h2 className="text-2xl font-bold text-gray-800 mt-12 mb-4">
							Recently added (Mock Data)
						</h2>
						<div className="space-y-4">
							{recentIdeas.map((idea, index) => (
								<div
									key={index}
									className="bg-gray-800 text-white p-4 rounded-lg flex justify-between items-center"
								>
									<div className="flex items-center">
										<Lightbulb
											className="mr-3"
											size={24}
											style={{ color: primaryColor }}
										/>
										<div>
											<h3 className="font-semibold">{idea.title}</h3>
											<p className="text-sm text-gray-400">
												{idea.days} days ago • {idea.votes} votes
											</p>
										</div>
									</div>
									<span className="text-2xl font-bold">{idea.votes}</span>
								</div>
							))}
						</div>
					</div>

					<CategorySidebar showNotification={showNotification} />
				</div>
			</div>
		</div>
	);
};
