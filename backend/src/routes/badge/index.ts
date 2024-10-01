import { Router } from 'express';
import { createBadge, getBadges, getBadgeById, updateBadge, deleteBadge } from '../../handlers/badgeHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';
import { validateRequest } from '../../middleware/validateRequest';
import { schemas } from '../../validation/schemas';

const router = Router();

router.post('/', auth, authorize(PERMISSIONS.MANAGE_BADGES), validateRequest(schemas.badge.create), createBadge);
router.get('/', getBadges);
router.get('/:id', validateRequest(schemas.badge.getById), getBadgeById);
router.put('/:id', auth, authorize(PERMISSIONS.MANAGE_BADGES), validateRequest(schemas.badge.update), updateBadge);
router.delete('/:id', auth, authorize(PERMISSIONS.MANAGE_BADGES), validateRequest(schemas.badge.delete), deleteBadge);

export default router;