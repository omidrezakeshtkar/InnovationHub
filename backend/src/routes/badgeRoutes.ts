import { Router } from 'express';
import { getBadges, createBadge, updateBadge, deleteBadge } from '../handlers/badgeHandlers';
import { auth } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { PERMISSIONS } from '../config/permissions';
import { validateRequest } from '../middleware/validateRequest';
import { badgeSchemas } from '../validation/schemas';

const router = Router();

/**
 * @swagger
 * /badges:
 *   get:
 *     summary: Get all badges
 *     tags: [Badges]
 *     responses:
 *       200:
 *         description: List of all badges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Badge'
 */
router.get('/', getBadges);

/**
 * @swagger
 * /badges:
 *   post:
 *     summary: Create a new badge (admin only)
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewBadge'
 *     responses:
 *       201:
 *         description: Created badge
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Badge'
 */
router.post('/', auth, authorize(PERMISSIONS.MANAGE_BADGES), validateRequest(badgeSchemas.create), createBadge);

/**
 * @swagger
 * /badges/{id}:
 *   put:
 *     summary: Update a badge (admin only)
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBadge'
 *     responses:
 *       200:
 *         description: Updated badge
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Badge'
 */
router.put('/:id', auth, authorize(PERMISSIONS.MANAGE_BADGES), validateRequest(badgeSchemas.update), updateBadge);

/**
 * @swagger
 * /badges/{id}:
 *   delete:
 *     summary: Delete a badge (admin only)
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Badge deleted successfully
 */
router.delete('/:id', auth, authorize(PERMISSIONS.MANAGE_BADGES), deleteBadge);

export default router;