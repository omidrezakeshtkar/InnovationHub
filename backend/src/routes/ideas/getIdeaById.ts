import { Router } from 'express';
import { getIdeaById } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /ideas/{id}:
 *   get:
 *     summary: Retrieve an idea by its ID
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the idea to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The idea with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Idea'
 *       404:
 *         description: Idea not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', auth, getIdeaById);

export default router;