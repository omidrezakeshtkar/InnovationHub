import { Schema, model, Document } from 'mongoose';

interface IBadge extends Document {
  name: string;
  description: string;
  imageUrl: string;
  pointThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const badgeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  pointThreshold: { type: Number, required: true },
}, { timestamps: true });

export default model<IBadge>('Badge', badgeSchema);