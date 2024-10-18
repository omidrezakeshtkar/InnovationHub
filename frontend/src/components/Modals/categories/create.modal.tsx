import React, { useState } from "react";
import axios from "axios";
import { Modal } from "../../Modal";
import { Category } from "./types";

interface CreateModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCategoryCreated: (category: Category) => void;
	showNotification: (
		message: string,
		type: "success" | "error" | "info"
	) => void;
	primaryColor: string;
}

const CreateCategoryModal: React.FC<CreateModalProps> = ({
	isOpen,
	onClose,
	onCategoryCreated,
	showNotification,
	primaryColor,
}) => {
	const [newCategory, setNewCategory] = useState({ name: "", description: "" });

	const handleCreateCategory = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const accessToken = localStorage.getItem("accessToken");
			if (!accessToken) {
				showNotification("No access token found", "error");
				return;
			}
			const response = await axios.post<Category>(
				"http://localhost:3000/api/categories",
				newCategory,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			onCategoryCreated(response.data);
			setNewCategory({ name: "", description: "" });
			onClose();
			showNotification("Category created successfully", "success");
		} catch (error) {
			console.error("Error creating category:", error);
			showNotification(
				"Error creating category. Please try again later.",
				"error"
			);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Create New Category</h2>
			<form onSubmit={handleCreateCategory}>
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
						value={newCategory.name}
						onChange={(e) =>
							setNewCategory({ ...newCategory, name: e.target.value })
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
						value={newCategory.description}
						onChange={(e) =>
							setNewCategory({ ...newCategory, description: e.target.value })
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
						Create
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

export default CreateCategoryModal;
