import React, { useEffect, useState } from "react";
import axios from "axios";
import LeftSidebar from "./left-sidebar";
import branding from "../../branding.json";

interface Author {
	_id: string;
	name: string;
}

interface Category {
	_id: string;
	name: string;
}

interface Idea {
	_id: string;
	title: string;
	description: string;
	author: Author;
	coAuthors: string[];
	status: string;
	category: Category;
	department: string;
	votes: number;
	devotes: number;
	netVotes: number;
	tags: string[];
	currentVersion: number;
	userVotes: string[];
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export const IdeasPendingApproval: React.FC = () => {
	const [ideas, setIdeas] = useState<Idea[]>([]);
	const primaryColor = branding.primaryColor;

	useEffect(() => {
		const fetchPendingIdeas = async () => {
			try {
				const accessToken = localStorage.getItem("accessToken");
				const response = await axios.get<Idea[]>(
					"http://localhost:3000/api/ideas/pending",
					{
						headers: { Authorization: `Bearer ${accessToken}` },
					}
				);
				setIdeas(response.data);
			} catch (error) {
				console.error("Error fetching pending ideas:", error);
			}
		};

		fetchPendingIdeas();
	}, []);

	const approveIdea = async (ideaId: string) => {
		try {
			const accessToken = localStorage.getItem("accessToken");
			await axios.post(
				`http://localhost:3000/api/ideas/${ideaId}/approve`,
				{},
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			);
			setIdeas(ideas.filter((idea) => idea._id !== ideaId));
		} catch (error) {
			console.error("Error approving idea:", error);
		}
	};

	const deleteIdea = async (ideaId: string) => {
		try {
			const accessToken = localStorage.getItem("accessToken");
			await axios.delete(`http://localhost:3000/api/ideas/${ideaId}`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			setIdeas(ideas.filter((idea) => idea._id !== ideaId));
		} catch (error) {
			console.error("Error deleting idea:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col md:flex-row">
					<LeftSidebar />
					<div className="flex-grow">
						<h1 className="text-3xl font-bold text-gray-800 mb-8">
							Ideas Pending Approval
						</h1>
						<div className="space-y-4 mb-8">
							{ideas.length > 0 ? (
								ideas.map((idea) => (
									<div
										key={idea._id}
										className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4"
									>
										<div className="flex-grow">
											<h3 className="text-xl font-semibold text-gray-800">
												{idea.title}
											</h3>
											<p className="text-sm text-gray-600">
												{idea.description}
											</p>
											<div className="grid grid-cols-2 gap-4 mt-4">
												<div className="bg-blue-100 rounded-lg p-2">
													<p className="text-blue-800 text-sm font-medium">
														Author: {idea.author.name}
													</p>
												</div>
												<div className="bg-green-100 rounded-lg p-2">
													<p className="text-green-800 text-sm font-medium">
														Department: {idea.department}
													</p>
												</div>
												<div className="bg-yellow-100 rounded-lg p-2">
													<p className="text-yellow-800 text-sm font-medium">
														Category: {idea.category.name}
													</p>
												</div>
												<div className="bg-red-100 rounded-lg p-2">
													<p className="text-red-800 text-sm font-medium">
														Created At:{" "}
														{new Date(idea.createdAt).toLocaleDateString()}
													</p>
												</div>
											</div>
										</div>
										<div className="flex flex-col space-y-2">
											<button
												className="text-white px-4 py-2 rounded-md transition duration-300"
												style={{
													backgroundColor: primaryColor,
												}}
												onClick={() => approveIdea(idea._id)}
											>
												Approve
											</button>
											<button
												className="text-white px-4 py-2 rounded-md transition duration-300 bg-red-500"
												onClick={() => deleteIdea(idea._id)}
											>
												Delete
											</button>
										</div>
									</div>
								))
							) : (
								<div className="text-gray-500 text-center py-4">
									No ideas pending approval
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default IdeasPendingApproval;
