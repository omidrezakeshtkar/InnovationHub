import { Router } from 'express';
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from '../../handlers/categoryHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';
import { validateRequest } from '../../middleware/validateRequest';
import { schemas } from '../../validation/schemas';

const router = Router();

router.post('/', auth, authorize(PERMISSIONS.MANAGE_CATEGORIES), validateRequest(schemas.category.create), createCategory);
router.get('/', getCategories);
router.get('/:id', validateRequest(schemas.category.getById), getCategoryById);
router.put('/:id', auth, authorize(PERMISSIONS.MANAGE_CATEGORIES), validateRequest(schemas.category.update), updateCategory);
router.delete('/:id', auth, authorize(PERMISSIONS.MANAGE_CATEGORIES), validateRequest(schemas.category.delete), deleteCategory);

export default router;