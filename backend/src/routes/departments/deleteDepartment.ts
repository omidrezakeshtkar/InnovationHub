import { Request, Response } from 'express';
import { Department } from '../../models/Department';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { PERMISSIONS } from '../../config/permissions';

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete a department
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
 *        200:
 *         description: Department deleted successfully
 *        404:
 *         description: Department not found
 */
export const deleteDepartmentRoute = [
  auth,
  authorize(PERMISSIONS.MANAGE_DEPARTMENTS),
  async (req: Request, res: Response) => {
    try {
      const department = await Department.findByIdAndDelete(req.params.id);
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }
      res.json({ message: 'Department deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting department', error });
    }
  }
];