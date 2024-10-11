import { Request, Response, NextFunction } from "express";
import Category from "../models/Category";
import { AppError } from "../middleware/errorHandler";
import logger from "../utils/logger";

// Handler to create a new category
export const createCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, description } = req.body;
		const existingCategory = await Category.findOne({ name });

		if (existingCategory) {
			throw new AppError("Category already exists", 400);
		}

		const category = new Category({ name, description });
		await category.save();

		logger.info(`Category created: ${name}`);
		res.status(201).json(category);
	} catch (error) {
		logger.error("Error creating category:", error);
		next(error);
	}
};

// Handler to update a category by ID
export const updateCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { name, description } = req.body;

		const category = await Category.findByIdAndUpdate(
			id,
			{ name, description },
			{ new: true, runValidators: true }
		);

		if (!category) {
			throw new AppError("Category not found", 404);
		}

		logger.info(`Category updated: ${id}`);
		res.json(category);
	} catch (error) {
		logger.error("Error updating category:", error);
		next(error);
	}
};

// Handler to delete a category by ID
export const deleteCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		const category = await Category.findByIdAndDelete(id);

		if (!category) {
			throw new AppError("Category not found", 404);
		}

		logger.info(`Category deleted: ${id}`);
		res.status(200).json({ message: "Category deleted successfully" });
	} catch (error) {
		logger.error("Error deleting category:", error);
		next(error);
	}
};

// Handler to get all categories
export const getCategories = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const categories = await Category.find();
		res.json(categories);
	} catch (error) {
		logger.error("Error fetching categories:", error);
		next(error);
	}
};

// Handler to get a category by ID or title
export const getCategoryByIdOrTitle = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { identifier } = req.params;

		const category = await Category.findOne({
			$or: [{ _id: identifier }, { name: identifier }],
		});

		if (!category) {
			throw new AppError("Category not found", 404);
		}

		res.json(category);
	} catch (error) {
		logger.error("Error fetching category by ID or title:", error);
		next(error);
	}
};
