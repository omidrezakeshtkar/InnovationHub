import { Router } from "express";
import createDepartmentRoute from "./createDepartmentRoute";
import updateDepartmentRoute from "./updateDepartmentRoute";
import getDepartmentsRoute from "./getDepartmentsRoute";
import getDepartmentByIdRoute from "./getDepartmentRoute";
import deleteDepartmentRoute from "./deleteDepartmentRoute";
import getUsersWithoutDepartmentsRoute from "./getUsersWithoutDepartmentsRoute";

const router = Router();

// Use the department route
router.use("/", createDepartmentRoute);
router.use("/", updateDepartmentRoute);
router.use("/", getDepartmentsRoute);
router.use("/", getUsersWithoutDepartmentsRoute);
router.use("/", getDepartmentByIdRoute);
router.use("/", deleteDepartmentRoute);

export default router;
