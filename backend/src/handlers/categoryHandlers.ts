import { Request, Response, NextFunction } from "express";
import Category from "../models/Category";
import Idea from "../models/Idea";
import { AppError } from "../middleware/errorHandler";
import logger from "../utils/logger";
import { CategoryUpdate } from "../schemas/Category.schema";
import mongoose from "mongoose";

// Handler to create a new category
export const createCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, description } = req.body as {
			name: string;
			description: string;
		};
		const existingCategory = await Category.findOne({ name });

		if (existingCategory) {
			return next(new AppError("Category already exists", 400));
		}

		const category = new Category({ name, description });
		await category.save();

		logger.info(`Category created: ${name}`);
		res.status(201).json(category);
	} catch (error) {
		logger.error("Error creating category:", error);
		return next(new AppError("Error creating category", 500));
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
		const { name, description } = req.body as Partial<CategoryUpdate["body"]>;

		const updateFields: Partial<CategoryUpdate["body"]> = {};

		if (name !== undefined) updateFields.name = name;
		if (description !== undefined) updateFields.description = description;

		const category = await Category.findByIdAndUpdate(
			id,
			{ $set: updateFields },
			{ new: true, runValidators: true }
		);

		if (!category) {
			return next(new AppError("Category not found", 404));
		}

		logger.info(`Category updated: ${id}`);
		res.json(category);
	} catch (error) {
		logger.error("Error updating category:", error);
		return next(new AppError("Error updating category", 500));
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

		const category = await Category.findById(id);

		if (!category) {
			return next(new AppError("Category not found", 404));
		}

		// Delete all ideas related to this category
		await Idea.deleteMany({ category: id });

		// Delete the category
		await Category.findByIdAndDelete(id);

		logger.info(`Category deleted: ${id}`);
		res
			.status(200)
			.json({ message: "Category and related ideas deleted successfully" });
	} catch (error) {
		logger.error("Error deleting category:", error);
		return next(new AppError("Error deleting category", 500));
	}
};

// Handler to get all categories with pagination
export const getCategories = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { limit = 10, offset = 0 } = req.query;

		const categories = await Category.find()
			.skip(Number(offset))
			.limit(Number(limit));

		const categoriesWithIdeasCount = await Promise.all(
			categories.map(async (category) => {
				const ideasCount = await Idea.countDocuments({
					category: category._id,
				});
				return {
					...category.toObject(),
					ideasCount,
				};
			})
		);

		res.json(categoriesWithIdeasCount);
	} catch (error) {
		logger.error("Error fetching categories:", error);
		return next(new AppError("Error fetching categories", 500));
	}
};

export const getCategoryByIdOrName = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id, name } = req.query;

		if (id && name) {
			return next(
				new AppError("Please provide either id or name, not both", 400)
			);
		}

		let categories;
		if (id) {
			if (mongoose.Types.ObjectId.isValid(id as string)) {
				categories = await Category.find({ _id: id });
			} else {
				return next(new AppError("Invalid id format", 400));
			}
		} else if (name) {
			const regex = new RegExp(name as string, "i");
			categories = await Category.find({ name: regex });
		} else {
			return next(new AppError("Please provide either id or name", 400));
		}

		if (categories.length === 0) {
			return next(new AppError("No matching categories found", 404));
		}

		const categoriesWithIdeasCount = await Promise.all(
			categories.map(async (category) => {
				const ideasCount = await Idea.countDocuments({
					category: category._id,
				});
				return {
					...category.toObject(),
					ideasCount,
				};
			})
		);

		res.json(categoriesWithIdeasCount);
	} catch (error) {
		logger.error("Error fetching category by ID or title:", error);
		return next(new AppError("Error fetching category", 500));
	}
};
