import { Router } from 'express';
import { createIdea } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';
import { validateRequest } from '../../middleware/validateRequest';
import { ideaSchemas } from '../../validation/schemas';

const router = Router();

/**
 * @swagger
 * /ideas:
 *   post:
 *     summary: Create a new idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewIdea'
 *     responses:
 *       201:
 *         description: Created idea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Idea'
 */
router.post('/', auth, authorize(PERMISSIONS.CREATE_IDEA), validateRequest(ideaSchemas.create), createIdea);

export default router;