import { Schema, model, Document } from 'mongoose';

interface INotification extends Document {
  recipient: Schema.Types.ObjectId;
  content: string;
  type: string;
  relatedIdea?: Schema.Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['idea_approved', 'new_comment', 'idea_status_change'], required: true },
  relatedIdea: { type: Schema.Types.ObjectId, ref: 'Idea' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default model<INotification>('Notification', notificationSchema);