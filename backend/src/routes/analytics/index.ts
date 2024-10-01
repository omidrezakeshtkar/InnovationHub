import { Router } from 'express';
import { getAnalytics, getCategoryAnalytics, getIdeaTrendsAnalytics, getOverallAnalytics, getUserEngagementAnalytics } from '../../handlers/analyticsHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';
import { validateRequest } from '../../middleware/validateRequest';
import { schemas } from '../../validation/schemas';

const router = Router();

router.get('/', auth, authorize(PERMISSIONS.VIEW_ANALYTICS), validateRequest(schemas.analytics.getAnalytics), getAnalytics);
router.get('/categories', auth, authorize(PERMISSIONS.VIEW_ANALYTICS), validateRequest(schemas.analytics.getCategoryAnalytics), getCategoryAnalytics);
router.get('/idea-trends', auth, authorize(PERMISSIONS.VIEW_ANALYTICS), validateRequest(schemas.analytics.getIdeaTrendsAnalytics), getIdeaTrendsAnalytics);
router.get('/overall', auth, authorize(PERMISSIONS.VIEW_ANALYTICS), validateRequest(schemas.analytics.getOverallAnalytics), getOverallAnalytics);
router.get('/user-engagement', auth, authorize(PERMISSIONS.VIEW_ANALYTICS), validateRequest(schemas.analytics.getUserEngagementAnalytics), getUserEngagementAnalytics);

export default router;
