import { Router } from 'express';
import { createBadge } from '../../handlers/badgeHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';
import { validateRequest } from '../../middleware/validateRequest';
import { badgeSchemas } from '../../validation/schemas';

const router = Router();

/**
 * @swagger
 * /badges:
 *   post:
 *     summary: Create a new badge (admin only)
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewBadge'
 *     responses:
 *       201:
 *         description: Created badge
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Badge'
 */
router.post('/', auth, authorize(PERMISSIONS.MANAGE_BADGES), validateRequest(badgeSchemas.create), createBadge);

export default router;