import React from "react";
import axios from "axios";
import { Modal } from "../../Modal";
import branding from "../../../branding.json";

interface DeleteIdeaModalProps {
	isOpen: boolean;
	onClose: () => void;
	onDeleteIdea: (ideaId: string) => void;
	showNotification: (
		message: string,
		type: "success" | "error" | "info"
	) => void;
}

const DeleteIdeaModal: React.FC<DeleteIdeaModalProps> = ({
	isOpen,
	onClose,
	onDeleteIdea,
	showNotification,
}) => {
	const primaryColor = branding.primaryColor || "var(--primary)";

	const handleDeleteIdea = async () => {
		try {
			const accessToken = localStorage.getItem("accessToken");
			if (!accessToken) {
				showNotification("No access token found", "error");
				return;
			}

			const urlParams = new URLSearchParams(window.location.search);
			const ideaId = urlParams.get("id");
			if (!ideaId) {
				showNotification("Error: Idea ID not found in URL", "error");
				return;
			}

			await axios.delete(`http://localhost:3000/api/ideas/${ideaId}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			onDeleteIdea(ideaId);
			onClose();
			showNotification("Idea deleted successfully", "success");
		} catch (error) {
			console.error("Error deleting idea:", error);
			showNotification("Error deleting idea. Please try again later.", "error");
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
			<p>Are you sure you want to delete this idea?</p>
			<div className="flex items-center justify-between mt-4">
				<button
					className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					style={{ backgroundColor: primaryColor }}
					onClick={handleDeleteIdea}
				>
					Delete
				</button>
				<button
					className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					onClick={onClose}
				>
					Cancel
				</button>
			</div>
		</Modal>
	);
};

export default DeleteIdeaModal;
