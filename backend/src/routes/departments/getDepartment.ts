import { Request, Response } from 'express';
import { Department } from '../../models/Department';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get a department by id
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The department
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       404:
 *         description: Department not found
 */
export const getDepartmentRoute = [
  auth,
  authorize(PERMISSIONS.VIEW_DEPARTMENT),
  async (req: Request, res: Response) => {
    try {
      const department = await Department.findById(req.params.id);
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }
      res.json(department);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving department', error });
    }
  }
];