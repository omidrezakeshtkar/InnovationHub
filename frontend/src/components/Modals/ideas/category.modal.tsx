import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import branding from "../../../branding.json";

type Category = {
	_id: string;
	name: string;
	ideasCount: number;
	description: string;
};

interface CategorySidebarProps {
	showNotification: (
		message: string,
		type: "success" | "error" | "info"
	) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
	showNotification,
}) => {
	const primaryColor = branding.primaryColor || "var(--primary)";
	const [categorySearchTerm, setCategorySearchTerm] = useState<string>("");
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		const fetchCategories = async () => {
			if (categorySearchTerm.trim() !== "") return;
			try {
				const response = await fetch(
					`http://localhost:3000/api/categories?limit=10&offset=0`
				);
				const data: Category[] = await response.json();
				setCategories(data);
			} catch {
				showNotification("Error fetching categories", "error");
			}
		};

		const fetchSearchedCategories = async () => {
			if (categorySearchTerm.trim() === "") {
				fetchCategories();
				return;
			}
			try {
				const response = await fetch(
					`http://localhost:3000/api/categories/search?name=${categorySearchTerm}`
				);
				const data: Category[] = await response.json();
				if (data.length === 0) {
					setCategories([]);
					showNotification("No categories found", "info");
				} else {
					setCategories(data);
				}
			} catch {
				setCategories([]);
				showNotification("Error searching categories", "error");
			}
		};

		fetchSearchedCategories();
	}, [categorySearchTerm, showNotification]);

	return (
		<div className="relative z-0">
			<h2 className="text-2xl font-bold text-gray-800 mb-4">Categories</h2>
			<div className="mb-4 relative">
				<input
					type="text"
					placeholder="Search categories"
					className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
					style={{
						borderColor: primaryColor,
						boxShadow: `0 0 0 2px ${primaryColor}30`,
					}}
					value={categorySearchTerm}
					onChange={(e) => setCategorySearchTerm(e.target.value)}
				/>
				<Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
			</div>
			<div className="bg-white rounded-lg shadow-md p-4">
				{categories.length > 0 ? (
					categories.map((category) => (
						<div
							key={category._id}
							className="flex justify-between items-center py-2 border-b last:border-b-0"
							title={category.description}
						>
							<span className="text-gray-700">{category.name}</span>
							<span className="text-gray-500">{category.ideasCount}</span>
						</div>
					))
				) : (
					<div className="text-gray-500 text-center py-4">
						No categories found
					</div>
				)}
			</div>
		</div>
	);
};
