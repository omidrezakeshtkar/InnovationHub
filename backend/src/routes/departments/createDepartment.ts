import { Request, Response } from 'express';
import { Department } from '../../models/Department';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';
import { validateRequest } from '../../middleware/validateRequest';
import { departmentSchemas } from '../../validation/schemas';

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewDepartment'
 *     responses:
 *       201:
 *         description: The created department
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       400:
 *         description: Error creating department
 */
export const createDepartmentRoute = [
  auth,
  authorize(PERMISSIONS.MANAGE_DEPARTMENTS),
  validateRequest(departmentSchemas.create),
  async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      const department = new Department({ name, description });
      await department.save();
      res.status(201).json(department);
    } catch (error) {
      res.status(400).json({ message: 'Error creating department', error });
    }
  }
];