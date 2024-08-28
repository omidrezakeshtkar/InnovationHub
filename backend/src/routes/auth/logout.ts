import { Router } from 'express';
import { logout } from '../../handlers/authHandlers'; // Adjusted import path

const router = Router();

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful logout
 */
router.post('/logout', logout);

export default router;