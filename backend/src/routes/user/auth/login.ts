import { Router } from "express";
import { login } from "../../../handlers/authHandlers"; // Adjusted import path
import { authLimiter } from "../../../middleware/rateLimiter"; // Adjusted import path
import { validateRequest } from "../../../middleware/validateRequest"; // Adjusted import path
import { authSchemas } from "../../../validation/schemas"; // Adjusted import path

const router = Router();

/**
 * @swagger
 * /user/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", authLimiter, validateRequest(authSchemas.login), login);

export default router;
