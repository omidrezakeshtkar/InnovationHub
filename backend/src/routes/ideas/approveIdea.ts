import { Router } from 'express';
import { approveIdea } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';

const router = Router();

router.post('/:id/approve', auth, authorize(PERMISSIONS.APPROVE_IDEA), approveIdea);

export default router;