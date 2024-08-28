import { Router } from 'express';
import getIdeasRouter from './getIdeas';
import getIdeaByIdRouter from './getIdeaById';
import createIdeaRouter from './createIdea';
import updateIdeaRouter from './updateIdea';
import deleteIdeaRouter from './deleteIdea';
import approveIdeaRouter from './approveIdea';
import voteIdeaRouter from './voteIdea';
import addCommentRouter from './addComment';
import getIdeaVersionsRouter from './getIdeaVersions';

const router = Router();

router.use('/', getIdeasRouter);
router.use('/', getIdeaByIdRouter);
router.use('/', createIdeaRouter);
router.use('/', updateIdeaRouter);
router.use('/', deleteIdeaRouter);
router.use('/', approveIdeaRouter);
router.use('/', voteIdeaRouter);
router.use('/', addCommentRouter);
router.use('/', getIdeaVersionsRouter);

export default router;