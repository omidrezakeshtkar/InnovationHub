import { Router } from 'express';
import { getIdeaById } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /ideas/{id}:
 *   get:
 *     summary: Get an idea by ID
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An idea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Idea'
 */
router.get('/:id', auth, getIdeaById);

export default router;