import { Router } from 'express';
import { getIdeas } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';

const router = Router();

/**
 * @swagger
 * /ideas:
 *   get:
 *     summary: Retrieve all ideas
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Idea'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', auth, authorize(PERMISSIONS.VIEW_ALL_IDEAS), getIdeas);

export default router;