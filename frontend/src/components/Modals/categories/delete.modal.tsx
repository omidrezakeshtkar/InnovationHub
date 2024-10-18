import React from "react";
import axios from "axios";
import { Modal } from "../../Modal";

interface DeleteCategoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	categoryId: string | null;
	onCategoryDeleted: (categoryId: string) => void;
	showNotification: (
		message: string,
		type: "success" | "error" | "info"
	) => void;
	primaryColor: string;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
	isOpen,
	onClose,
	categoryId,
	onCategoryDeleted,
	showNotification,
	primaryColor,
}) => {
	const handleDeleteCategory = async () => {
		if (!categoryId) return;

		try {
			const accessToken = localStorage.getItem("accessToken");
			if (!accessToken) {
				showNotification("No access token found", "error");
				return;
			}
			await axios.delete(`http://localhost:3000/api/categories/${categoryId}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			onCategoryDeleted(categoryId);
			onClose();
			showNotification("Category deleted successfully", "success");
		} catch (error) {
			console.error("Error deleting category:", error);
			showNotification(
				"Error deleting category. Please try again later.",
				"error"
			);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
			<p>
				Are you sure you want to delete this category? This will also delete all
				ideas within this category.
			</p>
			<div className="flex items-center justify-between mt-4">
				<button
					className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					style={{ backgroundColor: primaryColor }}
					onClick={handleDeleteCategory}
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

export default DeleteCategoryModal;
