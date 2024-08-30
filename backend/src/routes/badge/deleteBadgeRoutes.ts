import { Router } from 'express';
import { deleteBadge } from '../../handlers/badgeHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';

const router = Router();

/**
 * @swagger
 * /badges/{id}:
 *   delete:
 *     summary: Delete a badge (admin only)
 *     tags: [Badges]
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
 *         description: Badge deleted successfully
 */
router.delete('/:id', auth, authorize(PERMISSIONS.MANAGE_BADGES), deleteBadge);

export default router;