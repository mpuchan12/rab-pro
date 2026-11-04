
import mongoose, { Schema, Model } from "mongoose";

export type UserRole =
  | "superadmin"
  | "admin"
  | "estimator"
  | "staff";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organizationId?: mongoose.Types.ObjectId;
  isActive: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "estimator", "staff"],
      default: "staff",
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
