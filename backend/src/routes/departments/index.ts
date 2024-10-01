import { Router } from 'express';
import { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment } from '../../handlers/departmentHandlers';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';
import { validateRequest } from '../../middleware/validateRequest';
import { schemas } from '../../validation/schemas';

const router = Router();

router.post('/', auth, authorize(PERMISSIONS.MANAGE_DEPARTMENTS), validateRequest(schemas.department.create), createDepartment);
router.get('/', getAllDepartments);
router.get('/:id', validateRequest(schemas.department.getById), getDepartmentById);
router.put('/:id', auth, authorize(PERMISSIONS.MANAGE_DEPARTMENTS), validateRequest(schemas.department.update), updateDepartment);
router.delete('/:id', auth, authorize(PERMISSIONS.MANAGE_DEPARTMENTS), validateRequest(schemas.department.delete), deleteDepartment);

export default router;
