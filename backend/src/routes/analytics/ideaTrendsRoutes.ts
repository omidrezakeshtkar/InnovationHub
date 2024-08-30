import { Router } from 'express';
import { getIdeaTrendsAnalytics } from '../../handlers/analyticsHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';

const router = Router();

/**
 * @swagger
 * /analytics/idea-trends:
 *   get:
 *     summary: Get idea trends analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Idea trends analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trendingIdeas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       votes:
 *                         type: number
 */
router.get('/idea-trends', auth, authorize(PERMISSIONS.VIEW_ANALYTICS), getIdeaTrendsAnalytics);

export default router;