import { Router } from 'express';
import overallAnalyticsRoutes from './overallAnalyticsRoutes';
import userEngagementRoutes from './userEngagementRoutes';
import ideaTrendsRoutes from './ideaTrendsRoutes';
import categoryAnalyticsRoutes from './categoryAnalyticsRoutes';
import analyticsRoutes from './analytics'; // Import the default analytics route

const router = Router();

// Assign routes to the main analytics router
router.use('/', analyticsRoutes); // Add the default analytics route
router.use('/overall', overallAnalyticsRoutes);
router.use('/user-engagement', userEngagementRoutes);
router.use('/idea-trends', ideaTrendsRoutes);
router.use('/categories', categoryAnalyticsRoutes);

export default router;
