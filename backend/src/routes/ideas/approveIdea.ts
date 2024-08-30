import { Router } from 'express';
import { approveIdea } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';

const router = Router();

/**
 * @swagger
 * /ideas/{id}/approve:
 *   post:
 *     summary: Approve an idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the idea to approve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Idea approved successfully
 *       403:
 *         description: Unauthorized to approve idea
 *       404:
 *         description: Idea not found
 */
router.post('/:id/approve', auth, authorize(PERMISSIONS.APPROVE_IDEA), approveIdea);

export default router;