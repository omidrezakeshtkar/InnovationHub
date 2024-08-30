import { Router } from 'express';
import { getOverallAnalytics } from '../../handlers/analyticsHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';

const router = Router();

/**
 * @swagger
 * /analytics/overall:
 *   get:
 *     summary: Get overall analytics data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overall analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalIdeas:
 *                   type: number
 *                 totalUsers:
 *                   type: number
 *                 totalVotes:
 *                   type: number
 */
router.get('/overall', auth, authorize(PERMISSIONS.VIEW_ANALYTICS), getOverallAnalytics);

export default router;