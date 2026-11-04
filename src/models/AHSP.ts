
import mongoose, { Schema, Model } from "mongoose";

const ComponentSchema = new Schema(
  {
    materialId: {
      type: Schema.Types.ObjectId,
      ref: "Material",
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["material", "labor", "equipment"],
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    coefficient: {
      type: Number,
      required: true,
      min: 0,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true }
);

const AHSPSchema = new Schema(
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
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    standard: {
      type: String,
      enum: ["AHSP", "CUSTOM"],
      default: "CUSTOM",
    },
    components: {
      type: [ComponentSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

AHSPSchema.index(
  { ownerId: 1, code: 1 },
  { unique: true }
);

const AHSP: Model<any> =
  mongoose.models.AHSP ||
  mongoose.model("AHSP", AHSPSchema);

export default AHSP;
