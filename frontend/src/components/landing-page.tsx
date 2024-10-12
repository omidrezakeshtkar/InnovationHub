import {
	Star,
	Users,
	Lightbulb,
	ArrowUp,
	PlusCircle,
	AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import branding from "../branding.json";
import { useEffect, useState } from "react";
import axios from "axios";

interface Idea {
	_id: string;
	title: string;
	description: string;
	votes: number;
}

interface Category {
	_id: string;
	name: string;
}

export function LandingPageComponent() {
	const primaryColor = branding.primaryColor || "var(--primary)";
	const secondaryColor = branding.secondaryColor || "var(--secondary)";
	const [trendingIdeas, setTrendingIdeas] = useState<Idea[]>([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchTrendingIdeas = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/api/analytics/idea-trends"
				);
				setTrendingIdeas(response.data.trendingIdeas.slice(0, 3));
			} catch (error) {
				console.error("Error fetching trending ideas:", error);
			}
		};

		const fetchCategories = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/api/categories"
				);
				setCategories(response.data.slice(0, 10));
			} catch (error) {
				console.error("Error fetching categories:", error);
			}
		};

		fetchTrendingIdeas();
		fetchCategories();

		// Check if user is authenticated
		const accessToken = localStorage.getItem("accessToken");
		const refreshToken = localStorage.getItem("refreshToken");
		setIsAuthenticated(!!accessToken && !!refreshToken);
	}, []);

	const handleCategoryClick = (categoryId: string) => {
		navigate(`/categories?action=info&id=${categoryId}`);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
			<main>
				{/* Hero Section */}
				<section className="py-20 text-center">
					<h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
						Share, Collaborate, Innovate
					</h1>
					<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
						Join our community of innovators and bring your ideas to life.
						InnovationHub is the platform where great minds connect and create
						the future.
					</p>
					<button
						className="btn text-white px-8 py-3 text-lg font-semibold transition duration-300"
						style={{ backgroundColor: primaryColor }}
					>
						Get Started
					</button>
				</section>

				{/* Trending Ideas Section */}
				<section className="py-16 bg-white">
					<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
						Trending Ideas
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{trendingIdeas.length > 0 ? (
							trendingIdeas.map((idea) => (
								<div
									key={idea._id}
									className="card bg-gray-50 p-6 shadow-md hover:shadow-lg transition duration-300"
								>
									<h3 className="text-xl font-semibold text-gray-800 mb-2">
										{idea.title}
									</h3>
									<p className="text-gray-600 mb-4">{idea.description}</p>
									<div
										className="flex items-center"
										style={{ color: primaryColor }}
									>
										<ArrowUp size={20} />
										<span className="ml-1 font-semibold">{idea.votes}</span>
									</div>
								</div>
							))
						) : (
							<div className="col-span-3 text-center">
								<PlusCircle
									size={48}
									className="mx-auto mb-4"
									style={{ color: primaryColor }}
								/>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">
									No Trending Ideas Yet
								</h3>
								<p className="text-gray-600 mb-4">
									Be the first to create a trending idea! Your innovation could
									inspire others.
								</p>
								{isAuthenticated && (
									<Link
										to="/ideas/new"
										className="inline-block px-6 py-2 rounded-md text-white transition duration-300 hover:opacity-90"
										style={{ backgroundColor: primaryColor }}
									>
										Create Your First Idea
									</Link>
								)}
							</div>
						)}
					</div>
				</section>

				{/* Categories Section */}
				<section className="py-16 bg-purple-50">
					<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
						Popular Categories
					</h2>
					{categories.length > 0 ? (
						<div className="flex flex-wrap justify-center gap-4">
							{categories.map((category) => (
								<button
									key={category._id}
									className="btn bg-white px-6 py-3 shadow-md hover:shadow-lg transition duration-300"
									style={{ color: primaryColor }}
									onClick={() => handleCategoryClick(category._id)}
								>
									{category.name}
								</button>
							))}
						</div>
					) : (
						<div className="text-center">
							<AlertCircle
								size={48}
								className="mx-auto mb-4"
								style={{ color: primaryColor }}
							/>
							<h3 className="text-xl font-semibold text-gray-800 mb-2">
								No Categories Found
							</h3>
							<p className="text-gray-600 mb-4">
								We're working on adding exciting categories for you to explore.
								Check back soon!
							</p>
							<button
								className="btn text-white px-6 py-2 rounded-md transition duration-300 hover:opacity-90"
								style={{ backgroundColor: primaryColor }}
							>
								Refresh Categories
							</button>
						</div>
					)}
				</section>

				{/* Statistics Section */}
				<section className="py-16 bg-white">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
						{[
							{
								icon: Lightbulb,
								label: "Total Ideas Shared",
								value: "50,000+",
							},
							{ icon: Users, label: "Active Users", value: "100,000+" },
							{ icon: Star, label: "Ideas Implemented", value: "5,000+" },
						].map((stat, index) => (
							<div key={index} className="flex flex-col items-center">
								<stat.icon
									size={48}
									style={{ color: primaryColor }}
									className="mb-4"
								/>
								<span className="text-4xl font-bold text-gray-800 mb-2">
									{stat.value}
								</span>
								<span className="text-xl text-gray-600">{stat.label}</span>
							</div>
						))}
					</div>
				</section>

				{/* Testimonials Section */}
				<section className="py-16 bg-purple-50">
					<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
						What Our Users Say
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{[
							{
								quote:
									"InnovationHub has been instrumental in bringing my startup idea to life. The community feedback was invaluable!",
								author: "Sarah K., Entrepreneur",
							},
							{
								quote:
									"As an investor, I've found some of the most innovative projects on this platform. It's a goldmine of creativity!",
								author: "Michael R., Angel Investor",
							},
						].map((testimonial, index) => (
							<div key={index} className="card bg-white p-6 shadow-md">
								<p className="text-gray-600 italic mb-4">
									"{testimonial.quote}"
								</p>
								<p className="text-gray-800 font-semibold">
									- {testimonial.author}
								</p>
							</div>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
