import { Router } from 'express';
import { deleteIdea } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';

const router = Router();

router.delete('/:id', auth, authorize(PERMISSIONS.DELETE_IDEA), deleteIdea);

export default router;