import { Router } from "express";
import createDepartmentRoutes from "./createDepartment";
import updateDepartmentRoutes from "./updateDepartment";
import getDepartmentsRoutes from "./getDepartments";
import getDepartmentByIdRoutes from "./getDepartment";
import deleteDepartmentRoutes from "./deleteDepartment";

const router = Router();

// Use the department routes
router.use("/", createDepartmentRoutes);
router.use("/", updateDepartmentRoutes);
router.use("/", getDepartmentsRoutes);
router.use("/", getDepartmentByIdRoutes);
router.use("/", deleteDepartmentRoutes);

export default router;
