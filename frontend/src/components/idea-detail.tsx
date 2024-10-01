import React, { useState } from "react";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";
import { useParams, Link } from "react-router-dom";

// This mock data should be replaced with actual API calls in a real application
const mockIdea = {
	id: "1",
	title: "Real-time chat with customers",
	description: "In the new chat widget, we're adding a feature that will allow you to start a conversation with a customer in real time. This will be useful for those times when you need to provide assistance quickly or answer questions about your product or service.",
	author: "Amelia Watson",
	upvotes: 1000,
	downvotes: 0,
	comments: 150,
	status: "In Review",
	categories: ["Customer Support", "Real-time", "Communication"],
	comments: [
		{ id: "1", author: "Mia", content: "This is a great idea. I would love to see this feature implemented. It would make it so much easier to help our customers.", timestamp: "2023-06-15T10:30:00Z", upvotes: 120, downvotes: 5 },
		{ id: "2", author: "Ella", content: "I agree. This feature would be very helpful. I hope they implement it soon.", timestamp: "2023-06-16T11:45:00Z", upvotes: 15, downvotes: 0 },
	],
	relatedIdeas: [
		{ id: "2", title: "Add link support to chat widget", description: "This feature would allow you to add links to your messages. This would be useful for providing more information about a topic or pointing customers to relevant resources.", votes: 800 },
	]
};

export function IdeaDetailComponent() {
	const { id } = useParams<{ id: string }>();
	const [commentText, setCommentText] = useState("");
	// In a real application, you would fetch the idea based on the id
	const idea = mockIdea;

	const handleCommentSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically submit the comment to your backend
		console.log("Submitting comment:", commentText);
		setCommentText("");
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-gray-800 mb-4">{idea.title}</h1>
				<p className="text-gray-600 mb-6">{idea.description}</p>
				
				<div className="grid grid-cols-3 gap-4 mb-8">
					<div className="bg-white p-4 rounded-lg shadow">
						<h2 className="text-lg font-semibold mb-2">Votes</h2>
						<p className="text-3xl font-bold">{idea.upvotes}</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow">
						<h2 className="text-lg font-semibold mb-2">Comments</h2>
						<p className="text-3xl font-bold">{idea.comments.length}</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow">
						<h2 className="text-lg font-semibold mb-2">Status</h2>
						<p className="text-3xl font-bold">{idea.status}</p>
					</div>
				</div>

				<button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300 mb-8">
					Vote on this idea
				</button>

				<h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments ({idea.comments.length})</h2>
				<div className="space-y-4 mb-8">
					{idea.comments.map((comment) => (
						<div key={comment.id} className="bg-white p-4 rounded-lg shadow">
							<div className="flex items-center mb-2">
								<img src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.author}`} alt={comment.author} className="w-10 h-10 rounded-full mr-3" />
								<div>
									<p className="font-semibold">{comment.author}</p>
									<p className="text-sm text-gray-500">{new Date(comment.timestamp).toLocaleString()}</p>
								</div>
							</div>
							<p className="text-gray-700 mb-2">{comment.content}</p>
							<div className="flex items-center text-gray-500">
								<ArrowUp size={16} className="mr-1" />
								<span className="mr-4">{comment.upvotes}</span>
								<ArrowDown size={16} className="mr-1" />
								<span>{comment.downvotes}</span>
							</div>
						</div>
					))}
				</div>

				<form onSubmit={handleCommentSubmit} className="mb-8">
					<textarea
						className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
						rows={4}
						placeholder="Add a comment..."
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
					></textarea>
					<button type="submit" className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300">
						Post Comment
					</button>
				</form>

				<h2 className="text-2xl font-semibold text-gray-800 mb-4">Related Ideas</h2>
				<div className="space-y-4">
					{idea.relatedIdeas.map((relatedIdea) => (
						<div key={relatedIdea.id} className="bg-white p-4 rounded-lg shadow">
							<h3 className="text-xl font-semibold mb-2">{relatedIdea.title}</h3>
							<p className="text-gray-600 mb-2">{relatedIdea.description}</p>
							<div className="flex items-center text-purple-600">
								<ArrowUp size={20} className="mr-1" />
								<span>{relatedIdea.votes} votes</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}