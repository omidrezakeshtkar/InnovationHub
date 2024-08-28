import { Router } from 'express';
import { register } from '../../handlers/authHandlers'; // Adjusted import path
import { authLimiter } from '../../middleware/rateLimiter'; // Adjusted import path
import { validateRequest } from '../../middleware/validateRequest'; // Adjusted import path
import { authSchemas } from '../../validation/schemas'; // Adjusted import path

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *               - department
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, moderator, admin, department_head]
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successful registration
 *       400:
 *         description: Bad request
 */
router.post('/register', authLimiter, validateRequest(authSchemas.register), register);

export default router;