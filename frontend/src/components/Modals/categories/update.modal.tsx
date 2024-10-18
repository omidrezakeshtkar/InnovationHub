import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "../../Modal";
import { Category } from "./types";

interface UpdateModalProps {
	isOpen: boolean;
	onClose: () => void;
	category: Category | null;
	onCategoryUpdated: (category: Category) => void;
	showNotification: (
		message: string,
		type: "success" | "error" | "info"
	) => void;
	primaryColor: string;
}

const UpdateCategoryModal: React.FC<UpdateModalProps> = ({
	isOpen,
	onClose,
	category,
	onCategoryUpdated,
	showNotification,
	primaryColor,
}) => {
	const [editCategory, setEditCategory] = useState<Category | null>(null);

	useEffect(() => {
		setEditCategory(category);
	}, [category]);

	const handleEditCategory = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editCategory) return;

		try {
			const accessToken = localStorage.getItem("accessToken");
			if (!accessToken) {
				showNotification("No access token found", "error");
				return;
			}
			const response = await axios.put<Category>(
				`http://localhost:3000/api/categories/${editCategory._id}`,
				{
					name: editCategory.name,
					description: editCategory.description,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			onCategoryUpdated(response.data);
			onClose();
			showNotification("Category updated successfully", "success");
		} catch (error) {
			console.error("Error updating category:", error);
			showNotification(
				"Error updating category. Please try again later.",
				"error"
			);
		}
	};

	if (!editCategory) return null;

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Edit Category</h2>
			<form onSubmit={handleEditCategory}>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="name"
					>
						Name
					</label>
					<input
						type="text"
						id="name"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						value={editCategory.name}
						onChange={(e) =>
							setEditCategory({ ...editCategory, name: e.target.value })
						}
						required
					/>
				</div>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="description"
					>
						Description
					</label>
					<textarea
						id="description"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						value={editCategory.description}
						onChange={(e) =>
							setEditCategory({ ...editCategory, description: e.target.value })
						}
						required
					></textarea>
				</div>
				<div className="flex items-center justify-between">
					<button
						type="submit"
						className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						style={{ backgroundColor: primaryColor }}
					>
						Update
					</button>
					<button
						type="button"
						className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						onClick={onClose}
					>
						Cancel
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default UpdateCategoryModal;
