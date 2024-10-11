import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  department: string;
  permissions: string[];
  points: number;
  badges: string[];
  isDeleted: boolean;
  deletedAt?: Date;
  originalEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "moderator", "admin", "department_head", "owner"],
      default: "user",
    },
    department: { type: String, required: true },
    permissions: [{ type: String }],
    points: { type: Number, default: 0 },
    badges: [{ type: Schema.Types.ObjectId, ref: "Badge" }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    originalEmail: { type: String },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);