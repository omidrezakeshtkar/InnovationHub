import { Router } from 'express';
import { getBadges } from '../../handlers/badgeHandlers';

const router = Router();

/**
 * @swagger
 * /badges:
 *   get:
 *     summary: Get all badges
 *     tags: [Badges]
 *     responses:
 *       200:
 *         description: List of all badges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Badge'
 */
router.get('/', getBadges);

export default router;