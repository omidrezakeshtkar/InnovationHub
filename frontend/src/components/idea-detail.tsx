import React, { useState, useEffect } from "react";
import {
	MessageCircle,
	Tag,
	User,
	Calendar,
	ThumbsUp,
	ThumbsDown,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";
import branding from "../branding.json";
import axios from "axios";

interface Idea {
	_id: string;
	title: string;
	description: string;
	author: {
		_id: string;
		name: string;
	};
	coAuthors: Array<{ _id: string; name: string }>;
	status: string;
	category: {
		_id: string;
		name: string;
	};
	department: string;
	votes: number;
	devotes: number;
	netVotes: number;
	tags: string[];
	currentVersion: number;
	createdAt: string;
	updatedAt: string;
}

interface Comment {
	_id: string;
	content: string;
	author: {
		_id: string;
		name: string;
	};
	idea: string;
	createdAt: string;
	updatedAt: string;
}

interface CommentsResponse {
	comments: Comment[];
	totalComments: number;
	offset: number;
	limit: number;
	hasMore: boolean;
}

const mockRelatedIdeas = [
	{
		id: "2",
		title: "Add link support to chat widget",
		description:
			"This feature would allow you to add links to your messages. This would be useful for providing more information about a topic or pointing customers to relevant resources.",
		votes: 800,
	},
];

export function IdeaDetailComponent() {
	const primaryColor = branding.primaryColor || "var(--primary)";
	const { _id } = useParams<{ _id: string }>();
	const [idea, setIdea] = useState<Idea | null>(null);
	const [comments, setComments] = useState<Comment[]>([]);
	const [commentText, setCommentText] = useState("");

	useEffect(() => {
		fetchIdea();
		fetchComments();
	}, [_id]);

	const fetchIdea = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3000/api/ideas/search?_id=${_id}`
			);
			if (response.data.length > 0) {
				setIdea(response.data[0]);
			} else {
				setIdea({
					_id: "not-found",
					title: "Idea Not Found",
					description: "The requested idea could not be found.",
					author: { _id: "", name: "Unknown" },
					coAuthors: [],
					status: "Not Available",
					category: { _id: "", name: "Unknown" },
					department: "Unknown",
					votes: 0,
					devotes: 0,
					netVotes: 0,
					tags: [],
					currentVersion: 0,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				});
			}
		} catch (error) {
			console.error("Error fetching idea:", error);
		}
	};

	const fetchComments = async () => {
		try {
			const response = await axios.get<CommentsResponse>(
				`http://localhost:3000/api/ideas/${_id}/comments`
			);
			setComments(response.data.comments);
		} catch (error) {
			console.error("Error fetching comments:", error);
		}
	};

	const handleCommentSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const accessToken = localStorage.getItem("accessToken");
			if (!accessToken) {
				console.error("No access token found");
				return;
			}
			await axios.post(
				`http://localhost:3000/api/ideas/${_id}/comments`,
				{ content: commentText },
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			setCommentText("");
			fetchComments();
		} catch (error) {
			console.error("Error submitting comment:", error);
		}
	};

	const handleVote = async (voteType: "up" | "down") => {
		try {
			const accessToken = localStorage.getItem("accessToken");
			if (!accessToken) {
				console.error("No access token found");
				return;
			}
			await axios.post(
				`http://localhost:3000/api/ideas/${_id}/vote`,
				{ vote: voteType },
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			fetchIdea(); // Fetch the updated idea after voting
		} catch (error) {
			console.error("Error voting:", error);
		}
	};

	if (!idea)
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
			</div>
		);

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
					<div className="p-6">
						<h1 className="text-4xl font-bold text-gray-800 mb-4">
							{idea.title}
						</h1>
						<p className="text-gray-600 mb-6">{idea.description}</p>
						<div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
							<div className="flex items-center mr-4 mb-2">
								<User size={16} className="mr-1" />
								<span>{idea.author.name}</span>
							</div>
							<div className="flex items-center mr-4 mb-2">
								<Calendar size={16} className="mr-1" />
								<span>{new Date(idea.createdAt).toLocaleDateString()}</span>
							</div>
							<div className="flex items-center mr-4 mb-2">
								<Tag size={16} className="mr-1" />
								<span>{idea.category.name}</span>
							</div>
							{idea.tags.map((tag, index) => (
								<span
									key={index}
									className="bg-purple-100 text-purple-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded"
								>
									{tag}
								</span>
							))}
						</div>
						<div className="flex items-center space-x-4 mb-4">
							<button
								onClick={() => handleVote("up")}
								className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition duration-300"
							>
								<ThumbsUp size={20} className="mr-2" />
								<span className="font-semibold">{idea.votes}</span>
							</button>
							<button
								onClick={() => handleVote("down")}
								className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition duration-300"
							>
								<ThumbsDown size={20} className="mr-2" />
								<span className="font-semibold">{idea.devotes}</span>
							</button>
							<div className="flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-lg">
								<span className="font-semibold">
									Net Votes: {idea.netVotes}
								</span>
							</div>
						</div>
					</div>
					<div className="bg-gray-50 px-6 py-4">
						<div className="flex items-center justify-between text-sm text-gray-600">
							<span>
								Status: <span className="font-semibold">{idea.status}</span>
							</span>
							<span>
								Department:{" "}
								<span className="font-semibold">{idea.department}</span>
							</span>
							<span>
								Version:{" "}
								<span className="font-semibold">{idea.currentVersion}</span>
							</span>
						</div>
					</div>
				</div>

				<div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
					<div className="p-6">
						<h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
							<MessageCircle size={24} className="mr-2" />
							Comments ({comments.length})
						</h2>
						<div className="space-y-4 mb-8">
							{comments.map((comment) => (
								<div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
									<div className="flex items-center mb-2">
										<img
											src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.author.name}`}
											alt={comment.author.name}
											className="w-10 h-10 rounded-full mr-3"
										/>
										<div>
											<p className="font-semibold">{comment.author.name}</p>
											<p className="text-sm text-gray-500">
												{new Date(comment.createdAt).toLocaleString()}
											</p>
										</div>
									</div>
									<p className="text-gray-700">{comment.content}</p>
								</div>
							))}
						</div>
						<form onSubmit={handleCommentSubmit} className="mt-4">
							<textarea
								className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
								rows={4}
								placeholder="Add a comment..."
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
							></textarea>
							<button
								type="submit"
								className="mt-2 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300"
								style={{ backgroundColor: primaryColor }}
							>
								Post Comment
							</button>
						</form>
					</div>
				</div>

				<div className="bg-white shadow-lg rounded-lg overflow-hidden">
					<div className="p-6">
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">
							Related Ideas
						</h2>
						<div className="space-y-4">
							{mockRelatedIdeas.map((relatedIdea) => (
								<Link
									to={`/ideas/${relatedIdea.id}`}
									key={relatedIdea.id}
									className="block"
								>
									<div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition duration-300">
										<h3 className="text-xl font-semibold mb-2">
											{relatedIdea.title}
										</h3>
										<p className="text-gray-600 mb-2">
											{relatedIdea.description}
										</p>
										<div
											className="flex items-center"
											style={{ color: primaryColor }}
										>
											<ThumbsUp size={20} className="mr-1" />
											<span>{relatedIdea.votes} votes</span>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
