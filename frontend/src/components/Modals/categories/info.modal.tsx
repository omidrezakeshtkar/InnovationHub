import React from "react";
import { Modal } from "../../Modal";

interface Category {
	_id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	ideasCount: number;
}

interface InfoCategoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	category: Category | null;
}

const InfoCategoryModal: React.FC<InfoCategoryModalProps> = ({
	isOpen,
	onClose,
	category,
}) => {
	if (!category) {
		return null;
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className="text-xl font-bold mb-4">Category Information</h2>
			<div className="space-y-2">
				<p>
					<strong>Name:</strong> {category.name}
				</p>
				<p>
					<strong>Description:</strong> {category.description}
				</p>
				<p>
					<strong>Created At:</strong>{" "}
					{new Date(category.createdAt).toLocaleString()}
				</p>
				<p>
					<strong>Updated At:</strong>{" "}
					{new Date(category.updatedAt).toLocaleString()}
				</p>
				<p>
					<strong>Ideas Count:</strong> {category.ideasCount}
				</p>
				<div className="flex items-center justify-end mt-4">
					<button
						className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						onClick={onClose}
					>
						Close
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default InfoCategoryModal;