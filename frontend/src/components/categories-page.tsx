import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import branding from "../branding.json";

interface Category {
	_id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	ideasCount: number;
}

export function CategoriesPageComponent() {
	const primaryColor = branding.primaryColor || "var(--primary)";
	const secondaryColor = branding.secondaryColor || "var(--secondary)";
	const [searchTerm, setSearchTerm] = useState("");
	const [categories, setCategories] = useState<Category[]>([]);
	const [noResults, setNoResults] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const limit = 10;

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = (search: string = "", newSearch: boolean = false) => {
		const currentOffset = newSearch ? 0 : offset;
		const url = search
			? `http://localhost:3000/api/categories/search?name=${search}`
			: `http://localhost:3000/api/categories?limit=${limit}&offset=${currentOffset}`;

		fetch(url)
			.then((response) => {
				if (!response.ok) {
					if (response.status === 404) {
						throw new Error("No categories found");
					}
					throw new Error("Failed to fetch categories");
				}
				return response.json();
			})
			.then((data) => {
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
				}
				setError(null);
			})
			.catch((error) => {
				console.error("Error fetching categories:", error);
				if (error.message === "No categories found") {
					setError("No categories found");
				} else {
					setError("Error fetching categories. Please try again later.");
				}
				if (newSearch || currentOffset === 0) {
					setCategories([]);
				}
				setNoResults(false);
				setHasMore(false);
			});
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);
		setOffset(0);
		fetchCategories(value, true);
	};

	const loadMore = () => {
		setOffset((prevOffset) => prevOffset + limit);
		fetchCategories(searchTerm);
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

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">
							{searchTerm ? "Search Results" : "All Categories"}
						</h2>
						{error ? (
							<p className="text-red-500">{error}</p>
						) : noResults ? (
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
												<div className="text-sm text-gray-500">
													<p>
														Created:{" "}
														{new Date(category.createdAt).toLocaleDateString()}
													</p>
													<p>
														Updated:{" "}
														{new Date(category.updatedAt).toLocaleDateString()}
													</p>
													<p>Ideas: {category.ideasCount}</p>
												</div>
												<button
													className="text-white px-4 py-2 rounded-md transition duration-300 mt-4 hover:opacity-90"
													style={{
														backgroundColor: primaryColor,
													}}
												>
													Explore category
												</button>
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
