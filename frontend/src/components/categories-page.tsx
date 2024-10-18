import React, { useState, useEffect, useRef } from "react";
import { Search, Info, Edit, Trash } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import branding from "../branding.json";
import axios from "axios";

import CreateModal from "./Modals/categories/create.modal";
import UpdateModal from "./Modals/categories/update.modal";
import InfoModal from "./Modals/categories/info.modal";
import DeleteModal from "./Modals/categories/delete.modal";
import { Category } from "./Modals/categories/types";

export function CategoriesPageComponent({
	showNotification,
}: {
	showNotification: (
		message: string,
		type: "success" | "error" | "info"
	) => void;
}) {
	const primaryColor = branding.primaryColor || "var(--primary)";
	const secondaryColor = branding.secondaryColor || "var(--secondary)";
	const hoverColor = "#93A3FB"; // A color that complements 425efa for hover
	const [searchTerm, setSearchTerm] = useState("");
	const [categories, setCategories] = useState<Category[]>([]);
	const [noResults, setNoResults] = useState(false);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [editCategory, setEditCategory] = useState<Category | null>(null);
	const [infoCategory, setInfoCategory] = useState<Category | null>(null);
	const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const limit = 10;

	const isLoggedIn =
		!!localStorage.getItem("accessToken") &&
		!!localStorage.getItem("refreshToken");

	const location = useLocation();
	const navigate = useNavigate();

	const initialLoad = useRef(false);

	useEffect(() => {
		const loadInitialCategories = () => {
			fetchCategories();
			initialLoad.current = true;
		};
		if (!initialLoad.current) {
			loadInitialCategories();
		}
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const action = params.get("action");
		const id = params.get("id");

		switch (action) {
			case "create":
				setIsModalOpen(true);
				break;
			case "update":
				if (id) {
					const category = categories.find((cat) => cat._id === id);
					if (category) {
						setEditCategory(category);
						setIsEditModalOpen(true);
					}
				}
				break;
			case "delete":
				if (id) {
					setDeleteCategoryId(id);
					setIsDeleteModalOpen(true);
				}
				break;
			case "info":
				if (id) {
					handleMoreInfo(id);
				}
				break;
			default:
				break;
		}
	}, [location.search, categories]);

	const fetchCategories = async (
		search: string = "",
		newSearch: boolean = false
	) => {
		if (isLoading) return;
		setIsLoading(true);

		const currentOffset = newSearch ? 0 : offset;
		const url = search
			? `http://localhost:3000/api/categories/search?name=${search}`
			: `http://localhost:3000/api/categories?limit=${limit}&offset=${currentOffset}`;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				if (response.status === 404) {
					showNotification("No categories found", "info");
					throw new Error();
				}
				showNotification("Failed to fetch categories", "error");
				throw new Error();
			}
			const data = await response.json();
			if (Array.isArray(data) && data.length === 0) {
				setNoResults(true);
				setHasMore(false);
				if (newSearch || currentOffset === 0) {
					setCategories([]);
				}
			} else {
				setNoResults(false);
				if (newSearch || currentOffset === 0) {
					setCategories(data);
				} else {
					setCategories((prevCategories) => [...prevCategories, ...data]);
				}
				setHasMore(data.length === limit);
				setOffset(currentOffset + limit);
			}
			showNotification("Categories fetched successfully", "success");
		} catch {
			if (newSearch || currentOffset === 0) {
				setCategories([]);
			}
			setNoResults(false);
			setHasMore(false);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);
		setOffset(0);
		fetchCategories(value, true);
	};

	const loadMore = () => {
		if (!isLoading && hasMore) {
			fetchCategories(searchTerm);
		}
	};

	const handleMoreInfo = async (categoryId: string) => {
		try {
			const response = await axios.get(
				`http://localhost:3000/api/categories/search?id=${categoryId}`
			);
			if (response.data && response.data.length > 0) {
				setInfoCategory(response.data[0]);
				setIsInfoModalOpen(true);
				showNotification(
					"Category information fetched successfully",
					"success"
				);
			}
		} catch (error) {
			console.error("Error fetching category info:", error);
			showNotification(
				"Error fetching category info. Please try again later.",
				"error"
			);
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setIsEditModalOpen(false);
		setIsInfoModalOpen(false);
		setIsDeleteModalOpen(false);
		navigate("/categories");
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-4xl font-bold text-gray-800 mb-6">Categories</h1>
				<p className="text-xl text-gray-600 mb-8">
					Explore ideas by category or suggest new categories for organization
				</p>

				<div className="mb-8 relative">
					<input
						type="text"
						placeholder="Search categories"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
						style={{
							borderColor: primaryColor,
							boxShadow: `0 0 0 2px ${primaryColor}30`,
						}}
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search
						className="absolute right-3 top-2.5 text-gray-400"
						size={20}
					/>
				</div>

				{isLoggedIn && (
					<button
						className="mb-8 text-white px-4 py-2 rounded-md transition duration-300 hover:opacity-90"
						style={{ backgroundColor: primaryColor }}
						onClick={() => navigate("/categories?action=create")}
					>
						Create Category
					</button>
				)}

				<CreateModal
					isOpen={isModalOpen}
					onClose={closeModal}
					onCategoryCreated={(newCategory) => {
						setCategories((prevCategories) => [newCategory, ...prevCategories]);
						showNotification("Category created successfully", "success");
					}}
					showNotification={showNotification}
					primaryColor={primaryColor}
				/>

				<UpdateModal
					isOpen={isEditModalOpen}
					onClose={closeModal}
					category={editCategory as Category}
					onCategoryUpdated={(updatedCategory) => {
						setCategories((prevCategories) =>
							prevCategories.map((category) =>
								category._id === updatedCategory._id
									? updatedCategory
									: category
							)
						);
						showNotification("Category updated successfully", "success");
					}}
					showNotification={showNotification}
					primaryColor={primaryColor}
				/>

				<InfoModal
					isOpen={isInfoModalOpen}
					onClose={closeModal}
					category={infoCategory}
				/>

				<DeleteModal
					isOpen={isDeleteModalOpen}
					onClose={closeModal}
					categoryId={deleteCategoryId}
					onCategoryDeleted={(deletedCategoryId) => {
						setCategories((prevCategories) =>
							prevCategories.filter(
								(category) => category._id !== deletedCategoryId
							)
						);
						showNotification("Category deleted successfully", "success");
					}}
					showNotification={showNotification}
					primaryColor={primaryColor}
				/>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">
							{searchTerm ? "Search Results" : "All Categories"}
						</h2>
						{noResults ? (
							<p className="text-gray-600">No categories found.</p>
						) : (
							<>
								<div className="space-y-6">
									{categories.map((category) => (
										<div
											key={category._id}
											className="bg-white rounded-lg shadow-md overflow-hidden"
										>
											<div className="p-6">
												<h3 className="text-xl font-semibold text-gray-800 mb-2">
													{category.name}
												</h3>
												<p className="text-gray-600 mb-4">
													{category.description}
												</p>
												<div className="flex justify-between mt-4">
													<button
														className="flex items-center text-gray-800 px-4 py-2 rounded-md transition duration-300 hover:opacity-90"
														onClick={() =>
															navigate(
																`/categories?action=info&id=${category._id}`
															)
														}
													>
														<Info
															className="mr-2"
															size={16}
															style={{ color: primaryColor }}
															fill="none"
															onMouseEnter={(e) =>
																e.currentTarget.setAttribute("fill", hoverColor)
															}
															onMouseLeave={(e) =>
																e.currentTarget.setAttribute("fill", "none")
															}
														/>
													</button>
													{isLoggedIn && (
														<div className="flex space-x-2">
															<button
																className="flex items-center text-gray-800 px-4 py-2 rounded-md transition duration-300 hover:opacity-90"
																onClick={() =>
																	navigate(
																		`/categories?action=update&id=${category._id}`
																	)
																}
															>
																<Edit
																	className="mr-2"
																	size={16}
																	style={{ color: primaryColor }}
																	fill="none"
																	onMouseEnter={(e) =>
																		e.currentTarget.setAttribute(
																			"fill",
																			hoverColor
																		)
																	}
																	onMouseLeave={(e) =>
																		e.currentTarget.setAttribute("fill", "none")
																	}
																/>
															</button>
															<button
																className="flex items-center text-gray-800 px-4 py-2 rounded-md transition duration-300 hover:opacity-90"
																onClick={() =>
																	navigate(
																		`/categories?action=delete&id=${category._id}`
																	)
																}
															>
																<Trash
																	className="mr-2"
																	size={16}
																	style={{ color: primaryColor }}
																	fill="none"
																	onMouseEnter={(e) =>
																		e.currentTarget.setAttribute(
																			"fill",
																			hoverColor
																		)
																	}
																	onMouseLeave={(e) =>
																		e.currentTarget.setAttribute("fill", "none")
																	}
																/>
															</button>
														</div>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
								{!searchTerm && hasMore && (
									<button
										className="w-full bg-gray-200 text-gray-700 py-2 rounded-md mt-6 hover:bg-gray-300 transition duration-300"
										onClick={loadMore}
									>
										Load more
									</button>
								)}
							</>
						)}
					</div>

					<div>
						<h2 className="text-2xl font-bold text-gray-800 mb-4">
							Quick Links
						</h2>
						<div className="bg-white rounded-lg shadow-md p-4">
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
										to="/categories/popular"
										className="hover:underline"
										style={{ color: primaryColor }}
									>
										View popular categories
									</Link>
								</li>
								<li>
									<Link
										to="/categories/suggest"
										className="hover:underline"
										style={{ color: primaryColor }}
									>
										Suggest a new category
									</Link>
								</li>
								<li>
									<Link
										to="/faq"
										className="hover:underline"
										style={{ color: primaryColor }}
									>
										FAQ
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
