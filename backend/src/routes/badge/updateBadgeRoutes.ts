import { Router } from 'express';
import { updateBadge } from '../../handlers/badgeHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';
import { validateRequest } from '../../middleware/validateRequest';
import { badgeSchemas } from '../../validation/schemas';

const router = Router();

/**
 * @swagger
 * /badges/{id}:
 *   put:
 *     summary: Update a badge (admin only)
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBadge'
 *     responses:
 *       200:
 *         description: Updated badge
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Badge'
 */
router.put('/:id', auth, authorize(PERMISSIONS.MANAGE_BADGES), validateRequest(badgeSchemas.update), updateBadge);

export default router;