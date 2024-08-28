import { Request, Response } from "express";
import { Department } from "../../models/Department";

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Retrieve all departments
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: A list of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 */
export const getDepartmentsRoute = async (req: Request, res: Response) => {
	try {
		const departments = await Department.find();
		res.json(departments);
	} catch (error) {
		res.status(500).json({ message: "Error retrieving departments", error });
	}
};
