import { Request, Response, NextFunction } from "express";
import Department from "../models/Department";
import Idea from "../models/Idea";
import { AppError } from "../middleware/errorHandler";
import logger from "../utils/logger";

// Handler to create a new department
export const createDepartment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, description } = req.body as {
			name: string;
			description: string;
		};
		const existingDepartment = await Department.findOne({ name });

		if (existingDepartment) {
			return next(new AppError("Department already exists", 400));
		}

		const department = new Department({ name, description });
		await department.save();

		logger.info(`Department created: ${name}`);
		res.status(201).json(department);
	} catch (error) {
		logger.error("Error creating department:", error);
		return next(new AppError("Error creating department", 500));
	}
};

// Handler to update a department by ID
export const updateDepartment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { name, description } = req.body as {
			name: string;
			description: string;
		};

		const department = await Department.findByIdAndUpdate(
			id,
			{ name, description },
			{ new: true, runValidators: true }
		);

		if (!department) {
			return next(new AppError("Department not found", 404));
		}

		logger.info(`Department updated: ${id}`);
		res.json(department);
	} catch (error) {
		logger.error("Error updating department:", error);
		return next(new AppError("Error updating department", 500));
	}
};

// Handler to delete a department by ID
export const deleteDepartment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		const department = await Department.findByIdAndDelete(id);

		if (!department) {
			return next(new AppError("Department not found", 404));
		}

		logger.info(`Department deleted: ${id}`);
		res.status(200).json({ message: "Department deleted successfully" });
	} catch (error) {
		logger.error("Error deleting department:", error);
		return next(new AppError("Error deleting department", 500));
	}
};

// Handler to get all departments with pagination
export const getDepartments = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { limit = 10, offset = 0 } = req.query;

		const departments = await Department.find()
			.skip(Number(offset))
			.limit(Number(limit));

		const departmentsWithIdeasCount = await Promise.all(
			departments.map(async (department) => {
				const ideasCount = await Idea.countDocuments({
					department: department._id,
				});
				return {
					...department.toObject(),
					ideasCount,
				};
			})
		);

		res.json(departmentsWithIdeasCount);
	} catch (error) {
		logger.error("Error fetching departments:", error);
		return next(new AppError("Error fetching departments", 500));
	}
};

// Handler to get a department by ID
export const getDepartmentById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		const department = await Department.findById(id);

		if (!department) {
			return next(new AppError("Department not found", 404));
		}

		const ideasCount = await Idea.countDocuments({
			department: department._id,
		});
		const departmentWithIdeasCount = {
			...department.toObject(),
			ideasCount,
		};

		res.json(departmentWithIdeasCount);
	} catch (error) {
		logger.error("Error fetching department by ID:", error);
		return next(new AppError("Error fetching department", 500));
	}
};
