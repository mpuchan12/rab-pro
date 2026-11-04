
import mongoose, { Schema, Model } from "mongoose";

export interface IMaterial {
  ownerId: mongoose.Types.ObjectId;
  organizationId?: mongoose.Types.ObjectId;
  name: string;
  code: string;
  category: string;
  unit: string;
  price: number;
  supplier?: string;
  isActive: boolean;
}

const MaterialSchema = new Schema<IMaterial>(
  {
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
    category: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    supplier: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

MaterialSchema.index(
  { ownerId: 1, code: 1 },
  { unique: true }
);

const Material: Model<IMaterial> =
  mongoose.models.Material ||
  mongoose.model<IMaterial>("Material", MaterialSchema);

export default Material;
