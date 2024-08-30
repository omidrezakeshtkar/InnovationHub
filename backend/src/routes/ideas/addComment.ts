import { Router } from 'express';
import { addComment } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { ideaSchemas } from '../../validation/schemas';

const router = Router();

/**
 * @swagger
 * /ideas/{id}/comment:
 *   post:
 *     summary: Add a comment to an idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/models/Comment'
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/models/Comment'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/comment', auth, validateRequest(ideaSchemas.comment), addComment);

export default router;