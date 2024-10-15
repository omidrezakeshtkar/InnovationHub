import React, { useState, useEffect, useRef } from "react";
import { Search, Lightbulb, X, Plus } from "lucide-react";
import branding from "../branding.json";
import _ from "lodash";
import { Modal } from "./Modal";
import { useNavigate } from "react-router-dom";

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

type Category = {
	_id: string;
	name: string;
	ideasCount: number;
	description: string;
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

export function IdeasPageComponent({
	showNotification,
}: {
	showNotification: (
		message: string,
		type: "success" | "error" | "info"
	) => void;
}) {
	const primaryColor = branding.primaryColor || "var(--primary)";
	const [searchTerm, setSearchTerm] = useState("");
	const [categorySearchTerm, setCategorySearchTerm] = useState("");
	const [modalCategorySearchTerm, setModalCategorySearchTerm] = useState("");
	const [featuredIdeas, setFeaturedIdeas] = useState<Idea[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [modalCategories, setModalCategories] = useState<Category[]>([]);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [newIdea, setNewIdea] = useState({
		title: "",
		description: "",
		categoryId: "",
		tags: [] as string[],
	});
	const [showModal, setShowModal] = useState(false);
	const [userSelectedCategory, setUserSelectedCategory] = useState(false);
	const limit = 10;
	const hasFetchedIdeas = useRef(false);
	const hasShownAlert = useRef(false);
	const hasSearchedInModal = useRef(false);
	const hasOpenedModal = useRef(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchIdeas = async () => {
			if (hasFetchedIdeas.current) return; // Prevent duplicate fetch
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
				hasFetchedIdeas.current = true; // Mark ideas as fetched
			} catch {
				showNotification("Error fetching ideas", "error");
			}
		};

		fetchIdeas();
	}, [offset, showNotification]);

	useEffect(() => {
		const fetchCategories = async () => {
			if (categorySearchTerm.trim() !== "") return; // Disable fetchCategories if searching
			try {
				const response = await fetch(
					`http://localhost:3000/api/categories?limit=10&offset=0`
				);
				const data: Category[] = await response.json();
				setCategories(data);
			} catch {
				showNotification("Error fetching categories", "error");
			}
		};

		const fetchSearchedCategories = async () => {
			if (categorySearchTerm.trim() === "") {
				fetchCategories();
				return;
			}
			try {
				const response = await fetch(
					`http://localhost:3000/api/categories/search?name=${categorySearchTerm}`
				);
				const data: Category[] = await response.json();
				if (data.length === 0) {
					setCategories([]);
					showNotification("No categories found", "info");
				} else {
					setCategories(data);
				}
			} catch {
				setCategories([]);
				showNotification("Error searching categories", "error");
			}
		};

		fetchSearchedCategories();
	}, [categorySearchTerm, showNotification]);

	useEffect(() => {
		const fetchModalCategories = async () => {
			if (modalCategorySearchTerm.trim() === "") {
				setModalCategories([]);
				hasSearchedInModal.current = false; // Reset hasSearchedInModal when search term is empty
				return;
			}
			try {
				const response = await fetch(
					`http://localhost:3000/api/categories/search?name=${modalCategorySearchTerm}`
				);
				const data: Category[] = await response.json();
				if (Array.isArray(data)) {
					if (data.length === 0) {
						setModalCategories([]);
						if (hasSearchedInModal.current && hasOpenedModal.current) {
							showNotification("No categories found in modal", "error");
						}
					} else {
						setModalCategories(data);
					}
				} else if (!hasSearchedInModal.current) {
					setModalCategories([]);
					showNotification("Error: Invalid data format", "error");
					hasSearchedInModal.current = true; // Ensure the error is shown only once
				}
			} catch {
				setModalCategories([]);
				showNotification("Error searching categories in modal", "error");
			}
		};

		if (modalCategorySearchTerm.trim() !== "") {
			hasSearchedInModal.current = true;
		}

		fetchModalCategories();
	}, [modalCategorySearchTerm, showNotification]);

	const handleCreateIdea = async () => {
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
				setShowModal(false);
				setNewIdea({ title: "", description: "", categoryId: "", tags: [] });
				setOffset(0); // Reset offset to fetch from the beginning
				hasFetchedIdeas.current = false; // Reset fetch flag
				setModalCategorySearchTerm("");
				setModalCategories([]);
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
						className="mb-8 bg-blue-500 text-white px-4 py-2 rounded-md"
						onClick={() => {
							setShowModal(true);
							hasOpenedModal.current = true;
						}}
					>
						Create Idea
					</button>
				)}

				{showModal && (
					<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
						<div className="p-6 relative z-10">
							<h2 className="text-xl font-bold mb-4">Create New Idea</h2>
							<input
								type="text"
								placeholder="Title"
								className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md"
								value={newIdea.title}
								onChange={(e) =>
									setNewIdea({ ...newIdea, title: e.target.value })
								}
							/>
							<textarea
								placeholder="Description"
								className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md"
								value={newIdea.description}
								onChange={(e) =>
									setNewIdea({ ...newIdea, description: e.target.value })
								}
							/>
							<div className="mb-2 flex flex-wrap">
								{newIdea.tags.map((tag, index) => (
									<div
										key={index}
										className="flex items-center bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2"
									>
										<span className="mr-2">{tag}</span>
										<X
											className="cursor-pointer text-gray-600"
											size={16}
											onClick={() => {
												const updatedTags = newIdea.tags.filter(
													(_, i) => i !== index
												);
												setNewIdea({ ...newIdea, tags: updatedTags });
											}}
										/>
									</div>
								))}
							</div>
							<div className="relative mb-2">
								<input
									type="text"
									placeholder="Add a tag"
									className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
									onKeyDown={(e) => {
										if (e.key === "Enter" && e.currentTarget.value.trim()) {
											const newTag = e.currentTarget.value.trim();
											if (!newIdea.tags.includes(newTag)) {
												setNewIdea({
													...newIdea,
													tags: [...newIdea.tags, newTag],
												});
											}
											e.currentTarget.value = "";
										}
									}}
								/>
								<Plus
									className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
									size={20}
									onClick={(e) => {
										const input = e.currentTarget
											.previousSibling as HTMLInputElement;
										if (input && input.value.trim()) {
											const newTag = input.value.trim();
											if (!newIdea.tags.includes(newTag)) {
												setNewIdea({
													...newIdea,
													tags: [...newIdea.tags, newTag],
												});
											}
											input.value = "";
										}
									}}
								/>
							</div>
							<input
								type="text"
								placeholder="Search categories"
								className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md"
								value={modalCategorySearchTerm}
								onChange={(e) => {
									setModalCategorySearchTerm(e.target.value);
									setUserSelectedCategory(false);
								}}
								onPaste={(e) => {
									e.preventDefault();
									const pastedText = e.clipboardData.getData("Text");
									setModalCategorySearchTerm(pastedText);
									setUserSelectedCategory(false);
								}}
							/>
							<div className="mb-4">
								{!userSelectedCategory &&
									Array.isArray(modalCategories) &&
									modalCategories.map((category) => (
										<div
											key={category._id}
											className="flex justify-between items-center py-2 border-b last:border-b-0 cursor-pointer"
											onClick={() => {
												setNewIdea({
													...newIdea,
													categoryId: category._id,
												});
												setModalCategorySearchTerm(category.name);
												setUserSelectedCategory(true);
											}}
										>
											<span className="text-gray-700">{category.name}</span>
										</div>
									))}
								{!userSelectedCategory &&
									modalCategories.length === 0 &&
									hasOpenedModal.current &&
									hasSearchedInModal.current && (
										<div className="text-gray-500 text-center py-4">
											No categories found
										</div>
									)}
							</div>
							<div className="flex justify-between">
								<button
									className="bg-blue-500 text-white px-4 py-2 rounded-md"
									onClick={handleCreateIdea}
									disabled={!newIdea.categoryId}
								>
									Submit
								</button>
								<button
									className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
									onClick={() => setShowModal(false)}
								>
									Cancel
								</button>
							</div>
						</div>
					</Modal>
				)}

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
							Recently added
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

					<div className="relative z-0">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">
							Categories
						</h2>
						<div className="mb-4 relative">
							<input
								type="text"
								placeholder="Search categories"
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
								style={{
									borderColor: primaryColor,
									boxShadow: `0 0 0 2px ${primaryColor}30`,
								}}
								value={categorySearchTerm}
								onChange={(e) => setCategorySearchTerm(e.target.value)}
							/>
							<Search
								className="absolute right-3 top-2.5 text-gray-400"
								size={20}
							/>
						</div>
						<div className="bg-white rounded-lg shadow-md p-4">
							{categories.length > 0 ? (
								categories.map((category) => (
									<div
										key={category._id}
										className="flex justify-between items-center py-2 border-b last:border-b-0"
										title={category.description}
									>
										<span className="text-gray-700">{category.name}</span>
										<span className="text-gray-500">{category.ideasCount}</span>
									</div>
								))
							) : (
								<div className="text-gray-500 text-center py-4">
									No categories found
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
