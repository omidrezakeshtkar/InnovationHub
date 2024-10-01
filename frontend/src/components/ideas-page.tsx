import React, { useState } from 'react';
import { Search, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

const featuredIdeas = [
	{
		title: "Add a comment when you close a task",
		description: "When you close a task, it's important to communicate why it's being closed. We should add an optional comment field to the close task modal.",
		image: "/placeholder-image-1.jpg"
	},
	{
		title: "Customize the status labels in the task details panel",
		description: "We have a set of default status labels, but many teams work differently. It would be great if we could customize the labels that appear in the status dropdown in the task details panel.",
		image: "/placeholder-image-2.jpg"
	},
	{
		title: "Show previews of linked files in task comments",
		description: "When you paste a link to a Figma, Sketch, or other design file in a task comment, we should automatically generate a preview of the file below the comment.",
		image: "/placeholder-image-3.jpg"
	}
];

const recentIdeas = [
	{ title: "Add a shortcut to create a new task from anywhere in the app", days: 2, votes: 8 },
	{ title: "Add a shortcut to create a new task from anywhere in the app", days: 3, votes: 4 },
	{ title: "Add a shortcut to create a new task from anywhere in the app", days: 4, votes: 6 },
	{ title: "Add a shortcut to create a new task from anywhere in the app", days: 5, votes: 10 },
];

const categories = [
	{ name: "All categories", count: 23 },
	{ name: "New features", count: 23 },
	{ name: "Improvements", count: 23 },
	{ name: "UX", count: 23 },
	{ name: "Bug reports", count: 23 },
	{ name: "Mobile", count: 23 },
	{ name: "API", count: 23 },
	{ name: "Integrations", count: 23 },
	{ name: "Automation", count: 23 },
	{ name: "Security", count: 23 },
	{ name: "Enterprise", count: 23 },
	{ name: "Education", count: 23 },
];

export function IdeasPageComponent() {
	const [searchTerm, setSearchTerm] = useState("");

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Ideas Exchange</h1>
				<p className="text-xl text-gray-600 mb-8">Share your ideas and vote on others. Help us shape the future of our product</p>
				
				<div className="mb-8 relative">
					<input
						type="text"
						placeholder="Search for ideas"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">Featured</h2>
						<div className="space-y-6">
							{featuredIdeas.map((idea, index) => (
								<div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
									<img src={idea.image} alt={idea.title} className="w-full h-48 object-cover" />
									<div className="p-6">
										<h3 className="text-xl font-semibold text-gray-800 mb-2">{idea.title}</h3>
										<p className="text-gray-600 mb-4">{idea.description}</p>
										<button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300">
											View details
										</button>
									</div>
								</div>
							))}
						</div>

						<button className="w-full bg-gray-200 text-gray-700 py-2 rounded-md mt-6 hover:bg-gray-300 transition duration-300">
							Load more
						</button>

						<h2 className="text-2xl font-bold text-gray-800 mt-12 mb-4">Recently added</h2>
						<div className="space-y-4">
							{recentIdeas.map((idea, index) => (
								<div key={index} className="bg-gray-800 text-white p-4 rounded-lg flex justify-between items-center">
									<div className="flex items-center">
										<Lightbulb className="mr-3" size={24} />
										<div>
											<h3 className="font-semibold">{idea.title}</h3>
											<p className="text-sm text-gray-400">{idea.days} days ago • {idea.votes} votes</p>
										</div>
									</div>
									<span className="text-2xl font-bold">{idea.votes}</span>
								</div>
							))}
						</div>
					</div>

					<div>
						<h2 className="text-2xl font-bold text-gray-800 mb-4">Categories</h2>
						<div className="bg-white rounded-lg shadow-md p-4">
							{categories.map((category, index) => (
								<div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
									<span className="text-gray-700">{category.name}</span>
									<span className="text-gray-500">{category.count}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}