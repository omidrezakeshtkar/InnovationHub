import { Router } from 'express';
import { updateIdea } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';
import { validateRequest } from '../../middleware/validateRequest';
import { ideaSchemas } from '../../validation/schemas';

const router = Router();

/**
 * @swagger
 * /ideas/{id}:
 *   put:
 *     summary: Update an idea by its ID
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the idea to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IdeaUpdate'
 *     responses:
 *       200:
 *         description: The idea with the specified ID has been updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Idea'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Idea not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', auth, authorize(PERMISSIONS.EDIT_IDEA), validateRequest(ideaSchemas.update), updateIdea);

export default router;