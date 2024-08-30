import { Router } from 'express';
import { deleteIdea } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';

const router = Router();

/**
 * @swagger
 * /ideas/{id}:
 *   delete:
 *     summary: Delete an idea by its ID
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the idea to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The idea with the specified ID has been deleted
 *       404:
 *         description: The idea with the specified ID was not found
 */
router.delete('/:id', auth, authorize(PERMISSIONS.DELETE_IDEA), deleteIdea);

export default router;