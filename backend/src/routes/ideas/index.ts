import { Router } from 'express';
import { createIdea, getIdeas, getIdeaById, updateIdea, deleteIdea, approveIdea, voteIdea, addComment, getIdeaVersions } from '../../handlers/ideaHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';
import { validateRequest } from '../../middleware/validateRequest';
import { schemas } from '../../validation/schemas';

const router = Router();

router.post('/', auth, authorize(PERMISSIONS.CREATE_IDEA), validateRequest(schemas.idea.create), createIdea);
router.get('/', auth, authorize(PERMISSIONS.VIEW_ALL_IDEAS), getIdeas);
router.get('/:id', auth, validateRequest(schemas.idea.getById), getIdeaById);
router.put('/:id', auth, authorize(PERMISSIONS.EDIT_IDEA), validateRequest(schemas.idea.update), updateIdea);
router.delete('/:id', auth, authorize(PERMISSIONS.DELETE_IDEA), validateRequest(schemas.idea.delete), deleteIdea);
router.post('/:id/approve', auth, authorize(PERMISSIONS.APPROVE_IDEA), validateRequest(schemas.idea.approve), approveIdea);
router.post('/:id/vote', auth, validateRequest(schemas.idea.vote), voteIdea);
router.post('/:id/comment', auth, validateRequest(schemas.idea.comment), addComment);
router.get('/:id/versions', auth, validateRequest(schemas.idea.getVersions), getIdeaVersions);

export default router;