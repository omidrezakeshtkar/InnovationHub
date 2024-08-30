import { Router } from 'express';
import { updateUserProfile } from '../../../handlers/userHandlers';
import { auth } from '../../../middleware/auth';
import { validateRequest } from '../../../middleware/validateRequest';
import { userSchemas } from '../../../validation/schemas';

const router = Router();

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserProfile'
 *     responses:
 *       200:
 *         description: Updated user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.put('/', auth, validateRequest(userSchemas.updateProfile), updateUserProfile);

export default router;