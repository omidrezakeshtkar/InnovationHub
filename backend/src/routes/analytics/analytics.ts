import { Router } from 'express';
import { getAnalytics } from '../../handlers/analyticsHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';

const router = Router();

/**
 * @swagger
 * /analytics:
 *   get:
 *     summary: Get analytics data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overallStats:
 *                   type: object
 *                 topCategories:
 *                   type: array
 *                 userEngagement:
 *                   type: object
 *                 ideaTrends:
 *                   type: array
 */
router.get('/', auth, authorize(PERMISSIONS.VIEW_ANALYTICS), getAnalytics);

export default router;