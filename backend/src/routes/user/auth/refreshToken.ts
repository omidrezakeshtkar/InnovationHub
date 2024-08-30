import { Router } from 'express';
import { refreshToken } from '../../../handlers/authHandlers'; // Updated import path
import { auth } from '../../../middleware/auth'; // Adjusted import path

const router = Router();

/**
 * @swagger
 * /user/auth/refresh-token:
 *   post:
 *     summary: Refresh user token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh-token', auth, refreshToken);

export default router;