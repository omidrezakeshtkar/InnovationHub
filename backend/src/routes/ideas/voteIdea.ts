import { Router } from "express";
import { voteIdea } from "../../handlers/ideaHandlers";
import { auth } from "../../middleware/auth";

const router = Router();

/**
 * @swagger
 * /ideas/{id}/vote:
 *   post:
 *     summary: Vote for an idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the idea to vote for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vote successfully cast
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/:id/vote", auth, voteIdea);

export default router;
