import { Router } from "express";
import { register } from "../../../handlers/authHandlers";
import { authLimiter } from "../../../middleware/rateLimiter";
import { validateRequest } from "../../../middleware/validateRequest";
import { schemas } from "../../../validation/schemas"; // Updated import

const router = Router();

/**
 * @swagger
 * /user/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
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
router.post(
	"/register",
	authLimiter,
	validateRequest(schemas.user.register),
	register
);

export default router;
