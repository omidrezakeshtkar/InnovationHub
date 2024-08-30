import { Router } from 'express';
import getCategoriesRoutes from './getCategoriesRoutes';
import createCategoryRoutes from './createCategoryRoutes';
import updateCategoryRoutes from './updateCategoryRoutes';
import deleteCategoryRoutes from './deleteCategoryRoutes';

const router = Router();

// Assign routes to the main category router
router.use('/', getCategoriesRoutes);
router.use('/', createCategoryRoutes);
router.use('/', updateCategoryRoutes);
router.use('/', deleteCategoryRoutes);

export default router;