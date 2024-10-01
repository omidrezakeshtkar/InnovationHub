import React from "react";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";
import { useParams } from "react-router-dom";

// این داده‌ها باید از یک API واقعی دریافت شوند
const mockIdea = {
	id: "1",
	title: "AI-Powered Personal Assistant",
	description:
		"An AI assistant that learns and adapts to your personal needs, helping you manage your daily tasks more efficiently.",
	author: "John Doe",
	upvotes: 1280,
	downvotes: 120,
	categories: ["Technology", "AI", "Productivity"],
	comments: [
		{
			id: "1",
			author: "Alice",
			content: "This is a great idea! I'd love to see it implemented.",
			timestamp: "2023-06-15T10:30:00Z",
		},
		{
			id: "2",
			author: "Bob",
			content: "How would this differ from existing AI assistants?",
			timestamp: "2023-06-15T11:45:00Z",
		},
		{
			id: "3",
			author: "Charlie",
			content: "I can see this being very useful for busy professionals.",
			timestamp: "2023-06-15T13:20:00Z",
		},
	],
};

export function IdeaDetailComponent() {
	const { id } = useParams<{ id: string }>();
	// در یک اپلیکیشن واقعی، اینجا باید داده‌ها را بر اساس ID از سرور دریافت کنید
	const idea = mockIdea;

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-4xl font-bold text-gray-800 mb-4">{idea.title}</h1>
				<p className="text-gray-600 mb-6">{idea.description}</p>
				<div className="flex items-center mb-6">
					<p className="text-gray-700 mr-4">By {idea.author}</p>
					<div className="flex items-center">
						<ArrowUp className="text-green-500 mr-1" />
						<span className="text-green-500 mr-2">{idea.upvotes}</span>
						<ArrowDown className="text-red-500 mr-1" />
						<span className="text-red-500">{idea.downvotes}</span>
					</div>
				</div>
				<div className="mb-8">
					<h2 className="text-2xl font-semibold text-gray-800 mb-2">
						Categories
					</h2>
					<div className="flex flex-wrap gap-2">
						{idea.categories.map((category, index) => (
							<span
								key={index}
								className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
							>
								{category}
							</span>
						))}
					</div>
				</div>
				<div>
					<h2 className="text-2xl font-semibold text-gray-800 mb-4">
						Comments
					</h2>
					<div className="space-y-4">
						{idea.comments.map((comment) => (
							<div key={comment.id} className="bg-white p-4 rounded-lg shadow">
								<div className="flex justify-between items-center mb-2">
									<p className="font-semibold text-gray-700">
										{comment.author}
									</p>
									<p className="text-sm text-gray-500">
										{new Date(comment.timestamp).toLocaleString()}
									</p>
								</div>
								<p className="text-gray-600">{comment.content}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
