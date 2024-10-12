import { Router } from "express";
import createCategoryRoute from "./createCategoryRoute";
import updateCategoryRoute from "./updateCategoryRoute";
import getCategoriesRoute from "./getCategoriesRoute";
import getCategoryByIdOrNameRoute from "./getCategoryByIdOrNameRoute";
import deleteCategoryRoute from "./deleteCategoryRoute";

const router = Router();

// Use the category route
router.use("/", createCategoryRoute);
router.use("/", updateCategoryRoute);
router.use("/", getCategoriesRoute);
router.use("/", getCategoryByIdOrNameRoute);
router.use("/", deleteCategoryRoute);

export default router;
