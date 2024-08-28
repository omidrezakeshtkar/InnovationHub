import express from "express";
import { createDepartmentRoute } from './createDepartment';
import { getDepartmentsRoute } from './getDepartments'; // Public endpoint
import { getDepartmentRoute } from './getDepartment';
import { updateDepartmentRoute } from './updateDepartment';
import { deleteDepartmentRoute } from './deleteDepartment';

const router = express.Router();

// Make getDepartments public
router.get('/', getDepartmentsRoute); // No auth middleware here
router.post('/', createDepartmentRoute);
router.get('/:id', getDepartmentRoute);
router.put('/:id', updateDepartmentRoute);
router.delete('/:id', deleteDepartmentRoute);

export default router;
