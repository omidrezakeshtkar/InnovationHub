import React, { useState, useEffect, useRef } from "react";
import { X, Plus } from "lucide-react";
import { Modal } from "../../Modal";
import branding from "../../../branding.json";

type Category = {
	_id: string;
	name: string;
	ideasCount: number;
	description: string;
};

type NewIdea = {
	title: string;
	description: string;
	categoryId: string;
	tags: string[];
};

interface CreateIdeaModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreateIdea: (idea: NewIdea) => Promise<void>;
	showNotification: (
		message: string,
		type: "success" | "error" | "info"
	) => void;
}

const CreateIdeaModal: React.FC<CreateIdeaModalProps> = ({
	isOpen,
	onClose,
	onCreateIdea,
	showNotification,
}) => {
	const primaryColor = branding.primaryColor || "var(--primary)";
	const [newIdea, setNewIdea] = useState<NewIdea>({
		title: "",
		description: "",
		categoryId: "",
		tags: [],
	});
	const [modalCategorySearchTerm, setModalCategorySearchTerm] =
		useState<string>("");
	const [modalCategories, setModalCategories] = useState<Category[]>([]);
	const [userSelectedCategory, setUserSelectedCategory] =
		useState<boolean>(false);
	const hasSearchedInModal = useRef<boolean>(false);
	const hasOpenedModal = useRef<boolean>(false);

	useEffect(() => {
		const fetchModalCategories = async () => {
			if (modalCategorySearchTerm.trim() === "") {
				setModalCategories([]);
				hasSearchedInModal.current = false;
				return;
			}
			try {
				const response = await fetch(
					`http://localhost:3000/api/categories/search?name=${modalCategorySearchTerm}`
				);
				const data: Category[] = await response.json();
				if (Array.isArray(data)) {
					if (data.length === 0) {
						setModalCategories([]);
						if (hasSearchedInModal.current && hasOpenedModal.current) {
							showNotification("No categories found in modal", "error");
						}
					} else {
						setModalCategories(data);
					}
				} else if (!hasSearchedInModal.current) {
					setModalCategories([]);
					showNotification("Error: Invalid data format", "error");
					hasSearchedInModal.current = true;
				}
			} catch {
				setModalCategories([]);
				showNotification("Error searching categories in modal", "error");
			}
		};

		if (modalCategorySearchTerm.trim() !== "") {
			hasSearchedInModal.current = true;
		}

		fetchModalCategories();
	}, [modalCategorySearchTerm, showNotification]);

	const handleCreateIdea = async () => {
		await onCreateIdea(newIdea);
		setNewIdea({ title: "", description: "", categoryId: "", tags: [] });
		setModalCategorySearchTerm("");
		setModalCategories([]);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<div className="p-6 relative z-10">
				<h2 className="text-xl font-bold mb-4">Create New Idea</h2>
				<input
					type="text"
					placeholder="Title"
					className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md"
					value={newIdea.title}
					onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
				/>
				<textarea
					placeholder="Description"
					className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md"
					value={newIdea.description}
					onChange={(e) =>
						setNewIdea({ ...newIdea, description: e.target.value })
					}
				/>
				<div className="mb-2 flex flex-wrap">
					{newIdea.tags.map((tag, index) => (
						<div
							key={index}
							className="flex items-center bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2"
						>
							<span className="mr-2">{tag}</span>
							<X
								className="cursor-pointer text-gray-600"
								size={16}
								onClick={() => {
									const updatedTags = newIdea.tags.filter(
										(_, i) => i !== index
									);
									setNewIdea({ ...newIdea, tags: updatedTags });
								}}
							/>
						</div>
					))}
				</div>
				<div className="relative mb-2">
					<input
						type="text"
						placeholder="Add a tag"
						className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
						onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
							if (e.key === "Enter" && e.currentTarget.value.trim()) {
								const newTag = e.currentTarget.value.trim();
								if (!newIdea.tags.includes(newTag)) {
									setNewIdea({
										...newIdea,
										tags: [...newIdea.tags, newTag],
									});
								}
								e.currentTarget.value = "";
							}
						}}
					/>
					<Plus
						className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
						size={20}
						onClick={(e: React.MouseEvent<SVGSVGElement>) => {
							const input = e.currentTarget.previousSibling as HTMLInputElement;
							if (input && input.value.trim()) {
								const newTag = input.value.trim();
								if (!newIdea.tags.includes(newTag)) {
									setNewIdea({
										...newIdea,
										tags: [...newIdea.tags, newTag],
									});
								}
								input.value = "";
							}
						}}
					/>
				</div>
				<input
					type="text"
					placeholder="Search categories"
					className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md"
					value={modalCategorySearchTerm}
					onChange={(e) => {
						setModalCategorySearchTerm(e.target.value);
						setUserSelectedCategory(false);
					}}
					onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
						e.preventDefault();
						const pastedText = e.clipboardData.getData("Text");
						setModalCategorySearchTerm(pastedText);
						setUserSelectedCategory(false);
					}}
				/>
				<div className="mb-4">
					{!userSelectedCategory &&
						Array.isArray(modalCategories) &&
						modalCategories.map((category) => (
							<div
								key={category._id}
								className="flex justify-between items-center py-2 border-b last:border-b-0 cursor-pointer"
								onClick={() => {
									setNewIdea({
										...newIdea,
										categoryId: category._id,
									});
									setModalCategorySearchTerm(category.name);
									setUserSelectedCategory(true);
								}}
							>
								<span className="text-gray-700">{category.name}</span>
							</div>
						))}
					{!userSelectedCategory &&
						modalCategories.length === 0 &&
						hasOpenedModal.current &&
						hasSearchedInModal.current && (
							<div className="text-gray-500 text-center py-4">
								No categories found
							</div>
						)}
				</div>
				<div className="flex justify-between">
					<button
						className="text-white px-4 py-2 rounded-md"
						style={{ backgroundColor: primaryColor }}
						onClick={handleCreateIdea}
						disabled={!newIdea.categoryId}
					>
						Submit
					</button>
					<button
						className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
						onClick={onClose}
					>
						Cancel
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default CreateIdeaModal;
