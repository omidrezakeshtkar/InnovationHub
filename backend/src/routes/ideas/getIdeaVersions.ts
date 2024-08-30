import { Router } from 'express';
import { getIdeaVersions } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /ideas/{id}/versions:
 *   get:
 *     summary: Retrieve all versions of an idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the idea to retrieve its versions
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of idea versions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IdeaVersion'
 *       404:
 *         description: Idea not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/versions', auth, getIdeaVersions);

export default router;