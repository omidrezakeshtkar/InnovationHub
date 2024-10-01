import { useState } from "react";
import { ArrowUp, Search } from "lucide-react";
import { Link } from "react-router-dom";

const ideas = [
	{
		title: "Innovative AI Tool",
		description: "An AI tool that helps automate daily tasks.",
		author: "John D.",
		upvotes: 325,
		category: "Technology"
	},
	{
		title: "Eco-friendly Packaging",
		description: "Sustainable packaging solutions for businesses.",
		author: "Jane S.",
		upvotes: 287,
		category: "Environment"
	},
	{
		title: "Health Monitoring App",
		description: "An app to monitor and improve your health.",
		author: "Alice W.",
		upvotes: 256,
		category: "Health"
	},
	{
		title: "Smart Home Energy System",
		description: "Optimize your home's energy consumption with AI.",
		author: "Robert M.",
		upvotes: 198,
		category: "Technology"
	},
	{
		title: "Virtual Reality Education",
		description: "Immersive learning experiences for students.",
		author: "Emily L.",
		upvotes: 175,
		category: "Education"
	},
	{
		title: "Blockchain for Supply Chain",
		description: "Improve transparency in global supply chains.",
		author: "David K.",
		upvotes: 163,
		category: "Business"
	},
];

export function IdeasPageComponent() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [filteredIdeas, setFilteredIdeas] = useState(ideas);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		filterIdeas(term, selectedCategory);
	};

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const category = e.target.value;
		setSelectedCategory(category);
		filterIdeas(searchTerm, category);
	};

	const filterIdeas = (term: string, category: string) => {
		const filtered = ideas.filter(idea => 
			(idea.title.toLowerCase().includes(term) || idea.description.toLowerCase().includes(term)) &&
			(category === "All" || idea.category === category)
		);
		setFilteredIdeas(filtered);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16">
			<h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
				Ideas
			</h1>
			<div className="max-w-4xl mx-auto mb-8 flex gap-4">
				<div className="relative flex-grow">
					<input
						type="text"
						placeholder="Search ideas..."
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
				</div>
				<select
					className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
					value={selectedCategory}
					onChange={handleCategoryChange}
				>
					<option value="All">All Categories</option>
					<option value="Technology">Technology</option>
					<option value="Business">Business</option>
					<option value="Health">Health</option>
					<option value="Education">Education</option>
					<option value="Environment">Environment</option>
				</select>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{filteredIdeas.map((idea, index) => (
					<Link to={`/ideas/${index + 1}`} key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
						<h2 className="text-2xl font-bold text-gray-800 mb-2">
							{idea.title}
						</h2>
						<p className="text-gray-600 mb-4">{idea.description}</p>
							<div className="flex justify-between items-center">
								<p className="text-gray-800 font-semibold">- {idea.author}</p>
								<div className="flex items-center text-purple-600">
									<ArrowUp size={20} />
									<span className="ml-1 font-semibold">{idea.upvotes}</span>
								</div>
							</div>
							<div className="mt-2 text-sm text-gray-500">{idea.category}</div>
					</Link>
				))}
			</div>
		</div>
	);
}
