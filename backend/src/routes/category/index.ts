import { Router } from "express";
import createCategoryRoutes from "./createCategoryRoutes";
import updateCategoryRoutes from "./updateCategoryRoutes";
import getCategoriesRoutes from "./getCategoriesRoutes";
import getCategoryByIdOrTitleRoutes from "./getCategoryByIdOrTitleRoutes";
import deleteCategoryRoutes from "./deleteCategoryRoutes";

const router = Router();

// Use the category routes
router.use("/", createCategoryRoutes);
router.use("/", updateCategoryRoutes);
router.use("/", getCategoriesRoutes);
router.use("/", getCategoryByIdOrTitleRoutes);
router.use("/", deleteCategoryRoutes);

export default router;
