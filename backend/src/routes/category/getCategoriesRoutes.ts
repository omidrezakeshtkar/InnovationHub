import { Router } from 'express';
import { getCategories } from '../../handlers/categoryHandlers';

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories with optional search
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search term to filter categories by name
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', getCategories);

export default router;