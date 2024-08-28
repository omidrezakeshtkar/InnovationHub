import { Router } from 'express';
import { updateIdea } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';
import { validateRequest } from '../../middleware/validateRequest';
import { ideaSchemas } from '../../validation/schemas';

const router = Router();

router.put('/:id', auth, authorize(PERMISSIONS.EDIT_IDEA), validateRequest(ideaSchemas.update), updateIdea);

export default router;