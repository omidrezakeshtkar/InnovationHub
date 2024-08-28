import { Schema, model } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Department:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the department
 *         name:
 *           type: string
 *           description: The name of the department
 *         description:
 *           type: string
 *           description: A description of the department
 */
const departmentSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  // Add other relevant fields
});

export const Department = model('Department', departmentSchema);