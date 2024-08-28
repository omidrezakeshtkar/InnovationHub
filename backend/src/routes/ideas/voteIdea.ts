import { Router } from 'express';
import { voteIdea } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';

const router = Router();

router.post('/:id/vote', auth, voteIdea);

export default router;