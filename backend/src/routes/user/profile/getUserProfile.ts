import { Router } from 'express';
import { getUserProfile } from '../../../handlers/userHandlers';
import { auth } from '../../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/', auth, getUserProfile);

export default router;