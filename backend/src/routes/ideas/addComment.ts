import { Router } from 'express';
import { addComment } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { ideaSchemas } from '../../validation/schemas';

const router = Router();

router.post('/:id/comment', auth, validateRequest(ideaSchemas.comment), addComment);

export default router;