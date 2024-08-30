import { Router } from 'express';
import { getUserEngagementAnalytics } from '../../handlers/analyticsHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';

const router = Router();

/**
 * @swagger
 * /analytics/user-engagement:
 *   get:
 *     summary: Get user engagement analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User engagement analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activeUsers:
 *                   type: number
 *                 engagementRate:
 *                   type: number
 */
router.get('/user-engagement', auth, authorize(PERMISSIONS.VIEW_ANALYTICS), getUserEngagementAnalytics);

export default router;