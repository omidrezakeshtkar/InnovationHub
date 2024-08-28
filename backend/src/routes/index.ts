import { Router } from 'express';
import userRoutes from './userRoutes';
import ideaRoutes from './ideas'; // Adjusted import path
import authRoutes from './auth'; // Updated import path
import categoryRoutes from './categoryRoutes';
import badgeRoutes from './badgeRoutes';
import analyticsRoutes from './analyticsRoutes';
import departmentRoutes from './departments'; // Ensure this is correct

const router = Router();

router.use('/users', userRoutes);
router.use('/ideas', ideaRoutes);
router.use('/auth', authRoutes); // Updated to reflect new path
router.use('/categories', categoryRoutes);
router.use('/badges', badgeRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/departments', departmentRoutes); // No extra /api here

export default router;