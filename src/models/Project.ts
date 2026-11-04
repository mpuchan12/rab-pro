
import mongoose, { Schema, Model } from "mongoose";

export interface IProject {
  name: string;
  code: string;
  ownerId: mongoose.Types.ObjectId;
  organizationId?: mongoose.Types.ObjectId;
  description?: string;
  location?: string;
  buildingType: string;
  landArea: number;
  buildingArea: number;
  floors: number;
  status: "planning" | "ongoing" | "completed";
  budget: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },
    description: String,
    location: String,
    buildingType: {
      type: String,
      default: "custom",
    },
    landArea: {
      type: Number,
      default: 0,
      min: 0,
    },
    buildingArea: {
      type: Number,
      default: 0,
      min: 0,
    },
    floors: {
      type: Number,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: ["planning", "ongoing", "completed"],
      default: "planning",
    },
    budget: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

ProjectSchema.index(
  { ownerId: 1, code: 1 },
  { unique: true }
);

const Project: Model<IProject> =
  mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
