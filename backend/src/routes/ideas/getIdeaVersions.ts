import { Router } from 'express';
import { getIdeaVersions } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';

const router = Router();

router.get('/:id/versions', auth, getIdeaVersions);

export default router;