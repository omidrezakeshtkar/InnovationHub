import { Router } from 'express';
import getBadgesRoutes from './getBadgesRoutes';
import createBadgeRoutes from './createBadgeRoutes';
import updateBadgeRoutes from './updateBadgeRoutes';
import deleteBadgeRoutes from './deleteBadgeRoutes';

const router = Router();

// Assign routes to the main badge router
router.use('/', getBadgesRoutes);
router.use('/', createBadgeRoutes);
router.use('/', updateBadgeRoutes);
router.use('/', deleteBadgeRoutes);

export default router;