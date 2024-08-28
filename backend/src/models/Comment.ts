import { Schema, model, Document } from 'mongoose';

interface IComment extends Document {
  content: string;
  author: Schema.Types.ObjectId;
  idea: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  idea: { type: Schema.Types.ObjectId, ref: 'Idea', required: true },
}, { timestamps: true });

export default model<IComment>('Comment', commentSchema);