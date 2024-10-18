import React, { useState, useEffect } from "react";
import { Search, Lightbulb, Info, Edit, Trash } from "lucide-react";
import branding from "../branding.json";
import { useNavigate, useLocation } from "react-router-dom";
import { CategorySidebar } from "./Modals/ideas/category.modal";
import CreateIdeaModal from "./Modals/ideas/create.modal";
import UpdateIdeaModal from "./Modals/ideas/update.modal";
import DeleteIdeaModal from "./Modals/ideas/delete.modal";
import { decodeAccessToken } from "@/tokenServiceWorker";
import { TokenPayload } from "@/types/user.types";

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
	const [myIdeas, setMyIdeas] = useState<Idea[]>([]);
	const [offset, setOffset] = useState<number>(0);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
	const [activeTab, setActiveTab] = useState<string>("featured");
	const [hasFetchedIdeas, setHasFetchedIdeas] = useState<boolean>(false);
	const [hasFetchedMyIdeas, setHasFetchedMyIdeas] = useState<boolean>(false);
	const limit = 10;
	const navigate = useNavigate();
	const location = useLocation();

	const accessToken = localStorage.getItem("accessToken");
	const refreshToken = localStorage.getItem("refreshToken");
	const user = decodeAccessToken(accessToken || "") as TokenPayload;
	const isAdmin = user?.isAdmin || user?.isOwner;

	useEffect(() => {
		const fetchIdeas = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/ideas?limit=${limit}&offset=${offset}`
				);
				const data = await response.json();
				setHasMore(data.hasMore);
				if (offset === 0) {
					setFeaturedIdeas(data.ideas);
				} else {
					setFeaturedIdeas((prevIdeas) => [...prevIdeas, ...data.ideas]);
				}
			} catch {
				showNotification("Error fetching ideas", "error");
			}
		};

		fetchIdeas();
	}, [offset, showNotification, hasFetchedIdeas]);

	useEffect(() => {
		if (activeTab !== "myIdeas" || hasFetchedMyIdeas) return;

		const fetchMyIdeas = async () => {
			if (!accessToken) {
				showNotification("User not authenticated", "error");
				return;
			}
			try {
				const response = await fetch("http://localhost:3000/api/ideas/user", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				const data = await response.json();
				setMyIdeas(data || []);
				setHasFetchedMyIdeas(true);
			} catch {
				showNotification("Error fetching your ideas", "error");
			}
		};

		fetchMyIdeas();
	}, [activeTab, showNotification, hasFetchedMyIdeas]);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const action = params.get("action");
		const id = params.get("id");

		switch (action) {
			case "create":
				setIsCreateModalOpen(true);
				break;
			case "update":
				if (id) {
					const idea = featuredIdeas.find((idea) => idea._id === id);
					if (idea) {
						setSelectedIdea(idea);
						setIsUpdateModalOpen(true);
					}
				}
				break;
			case "delete":
				if (id) {
					const idea = featuredIdeas.find((idea) => idea._id === id);
					if (idea) {
						setSelectedIdea(idea);
						setIsDeleteModalOpen(true);
					}
				}
				break;
			default:
				break;
		}
	}, [location.search, featuredIdeas]);

	const handleCreateIdea = async (newIdea: NewIdea) => {
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
				setHasFetchedIdeas(false);
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

	const closeModal = () => {
		setIsCreateModalOpen(false);
		setIsUpdateModalOpen(false);
		setIsDeleteModalOpen(false);
		setSelectedIdea(null);
		navigate("/ideas");
	};

	const handleSearch = async (term: string) => {
		if (activeTab !== "featured") {
			setSearchTerm("");
			return;
		}

		setSearchTerm(term);

		if (term.trim() === "") {
			setOffset(0);
			setHasFetchedIdeas(false);
			return;
		}

		try {
			const response = await fetch(
				`http://localhost:3000/api/ideas/search?title=${term}`
			);
			const data = await response.json();
			setFeaturedIdeas(data);
		} catch {
			showNotification("Error searching ideas", "error");
		}
	};

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
						onChange={(e) => handleSearch(e.target.value)}
						disabled={activeTab !== "featured"}
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
						onClick={() => navigate("/ideas?action=create")}
					>
						Create Idea
					</button>
				)}

				<CreateIdeaModal
					isOpen={isCreateModalOpen}
					onClose={closeModal}
					onCreateIdea={handleCreateIdea}
					showNotification={showNotification}
				/>

				<UpdateIdeaModal
					isOpen={isUpdateModalOpen}
					onClose={closeModal}
					idea={selectedIdea}
					onUpdateIdea={(updatedIdea) => {
						setFeaturedIdeas((prevIdeas) =>
							prevIdeas.map((idea) =>
								idea._id === updatedIdea._id ? updatedIdea : idea
							)
						);
						showNotification("Idea updated successfully", "success");
					}}
					showNotification={showNotification}
				/>

				<DeleteIdeaModal
					isOpen={isDeleteModalOpen}
					onClose={closeModal}
					ideaId={selectedIdea?._id}
					onDeleteIdea={(deletedIdeaId) => {
						setFeaturedIdeas((prevIdeas) =>
							prevIdeas.filter((idea) => idea._id !== deletedIdeaId)
						);
						showNotification("Idea deleted successfully", "success");
					}}
					showNotification={showNotification}
				/>

				<div className="flex space-x-4 mb-8">
					<button
						className={`px-4 py-2 rounded-md ${
							activeTab === "featured" ? "text-white" : "text-gray-800"
						}`}
						style={{
							backgroundColor:
								activeTab === "featured" ? primaryColor : `${primaryColor}30`,
						}}
						onClick={() => setActiveTab("featured")}
					>
						Featured Ideas
					</button>
					{accessToken && refreshToken && (
						<button
							className={`px-4 py-2 rounded-md ${
								activeTab === "myIdeas" ? "text-white" : "text-gray-800"
							}`}
							style={{
								backgroundColor:
									activeTab === "myIdeas" ? primaryColor : `${primaryColor}30`,
							}}
							onClick={() => setActiveTab("myIdeas")}
						>
							My Ideas
						</button>
					)}
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{activeTab === "featured" && (
						<div className="lg:col-span-2">
							<h2 className="text-2xl font-bold text-gray-800 mb-4">
								Featured
							</h2>
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
											<div className="flex justify-between mt-4">
												<button
													className="flex items-center text-gray-800 px-4 py-2 rounded-md transition duration-300 hover:opacity-90"
													onClick={() => navigate(`/ideas/${idea._id}`)}
												>
													<Info
														className="mr-2"
														size={16}
														style={{ color: primaryColor }}
													/>
												</button>
												{accessToken && refreshToken && isAdmin && (
													<div className="flex space-x-2">
														<button
															className="flex items-center text-gray-800 px-4 py-2 rounded-md transition duration-300 hover:opacity-90"
															onClick={() =>
																navigate(`/ideas?action=delete&id=${idea._id}`)
															}
														>
															<Trash
																className="mr-2"
																size={16}
																style={{ color: primaryColor }}
															/>
														</button>
													</div>
												)}
											</div>
										</div>
									</div>
								))}

								{hasMore && (
									<button
										className="w-full bg-gray-200 text-gray-700 py-2 rounded-md mt-6 hover:bg-gray-300 transition duration-300"
										onClick={() => {
											setOffset((prevOffset) => prevOffset + limit);
											setHasFetchedIdeas(false);
										}}
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
						</div>
					)}

					{activeTab === "myIdeas" && (
						<div className="lg:col-span-2">
							<h2 className="text-2xl font-bold text-gray-800 mb-4">
								My Ideas
							</h2>
							<div className="space-y-6">
								{myIdeas.map((idea: Idea) => (
									<div
										key={idea._id}
										className="bg-white rounded-lg shadow-md overflow-hidden"
									>
										<div className="p-6">
											<h3 className="text-xl font-semibold text-gray-800 mb-2">
												{idea.title}
											</h3>
											<p className="text-gray-600 mb-4">{idea.description}</p>
											<div className="flex justify-between mt-4">
												<button
													className="flex items-center text-gray-800 px-4 py-2 rounded-md transition duration-300 hover:opacity-90"
													onClick={() => navigate(`/ideas/${idea._id}`)}
												>
													<Info
														className="mr-2"
														size={16}
														style={{ color: primaryColor }}
													/>
												</button>
												{accessToken && refreshToken && (
													<div className="flex space-x-2">
														<button
															className="flex items-center text-gray-800 px-4 py-2 rounded-md transition duration-300 hover:opacity-90"
															onClick={() =>
																navigate(`/ideas?action=update&id=${idea._id}`)
															}
														>
															<Edit
																className="mr-2"
																size={16}
																style={{ color: primaryColor }}
															/>
														</button>
														<button
															className="flex items-center text-gray-800 px-4 py-2 rounded-md transition duration-300 hover:opacity-90"
															onClick={() =>
																navigate(`/ideas?action=delete&id=${idea._id}`)
															}
														>
															<Trash
																className="mr-2"
																size={16}
																style={{ color: primaryColor }}
															/>
														</button>
													</div>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
					<CategorySidebar showNotification={showNotification} />
				</div>
			</div>
		</div>
	);
};
