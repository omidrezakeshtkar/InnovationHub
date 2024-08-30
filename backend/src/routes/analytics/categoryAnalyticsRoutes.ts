import { Router } from 'express';
import { getCategoryAnalytics } from '../../handlers/analyticsHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';

const router = Router();

/**
 * @swagger
 * /analytics/categories:
 *   get:
 *     summary: Get category analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categoryStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                       ideasSubmitted:
 *                         type: number
 */
router.get('/categories', auth, authorize(PERMISSIONS.VIEW_ANALYTICS), getCategoryAnalytics);

export default router;