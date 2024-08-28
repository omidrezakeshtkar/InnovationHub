import { Request, Response } from 'express';
import { Department } from '../../models/Department';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';
import { validateRequest } from '../../middleware/validateRequest';
import { departmentSchemas } from '../../validation/schemas';

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update a department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDepartment'
 *     responses:
 *       200:
 *         description: The updated department
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       404:
 *         description: Department not found
 */
export const updateDepartmentRoute = [
  auth,
  authorize(PERMISSIONS.MANAGE_DEPARTMENTS),
  validateRequest(departmentSchemas.update),
  async (req: Request, res: Response) => {
    try {
      const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }
      res.json(department);
    } catch (error) {
      res.status(400).json({ message: 'Error updating department', error });
    }
  }
];