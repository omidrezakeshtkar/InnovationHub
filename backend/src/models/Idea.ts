import { Schema, model, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Idea:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - author
 *         - category
 *         - department
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         author:
 *           type: string
 *           description: User ID of the author
 *         coAuthors:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of User IDs
 *         status:
 *           type: string
 *           enum: [draft, submitted, in_review, approved, implemented, rejected]
 *         category:
 *           type: string
 *           description: Category ID
 *         department:
 *           type: string
 *         votes:
 *           type: number
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         currentVersion:
 *           type: number
 *     NewIdea:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - category
 *         - department
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *           description: Category ID
 *         department:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 */
interface IIdea extends Document {
  title: string;
  description: string;
  author: Schema.Types.ObjectId;
  coAuthors: Schema.Types.ObjectId[];
  status: string;
  category: Schema.Types.ObjectId;
  department: string;
  votes: number;
  tags: string[];
  currentVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const ideaSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coAuthors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['draft', 'submitted', 'in_review', 'approved', 'implemented', 'rejected'], default: 'draft' },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  department: { type: String, required: true },
  votes: { type: Number, default: 0 },
  tags: [{ type: String }],
  currentVersion: { type: Number, default: 1 },
}, { timestamps: true });

export default model<IIdea>('Idea', ideaSchema);