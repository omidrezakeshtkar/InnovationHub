import { Request, Response, NextFunction } from "express";
import Department from "../models/Department";
import { AppError } from "../middleware/errorHandler";
import logger from "../utils/logger";

// Handler to create a new department
export const createDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;
    const existingDepartment = await Department.findOne({ name });

    if (existingDepartment) {
      throw new AppError("Department already exists", 400);
    }

    const department = new Department({ name, description });
    await department.save();

    logger.info(`Department created: ${name}`);
    res.status(201).json(department);
  } catch (error) {
    logger.error("Error creating department:", error);
    next(error);
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
    const { name, description } = req.body;

    const department = await Department.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!department) {
      throw new AppError("Department not found", 404);
    }

    logger.info(`Department updated: ${id}`);
    res.json(department);
  } catch (error) {
    logger.error("Error updating department:", error);
    next(error);
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
      throw new AppError("Department not found", 404);
    }

    logger.info(`Department deleted: ${id}`);
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    logger.error("Error deleting department:", error);
    next(error);
  }
};

// Handler to get all departments
export const getDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    logger.error("Error fetching departments:", error);
    next(error);
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
      throw new AppError("Department not found", 404);
    }

    res.json(department);
  } catch (error) {
    logger.error("Error fetching department by ID:", error);
    next(error);
  }
};