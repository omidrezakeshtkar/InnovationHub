import { Schema, model, Document } from 'mongoose';

interface ICategory extends Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
}, { timestamps: true });

export default model<ICategory>('Category', categorySchema);