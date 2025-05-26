import { mongoose } from "mongoose";

const woodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Enter Wood Name"],
    },
    description: {
      type: String,
      required: [true, "Enter Description"],
    },
    images: {
      type: [String], // Array of image URLs
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      required: [true, "Enter Wood Price"],
    },
    advantages: {
      type: [String], // Array of advantage strings
      default: [], // Default to an empty array if not provided
    },
  },
  { timestamps: true }
);

const woodModel = mongoose.models.wood || mongoose.model("Wood", woodSchema);

export default woodModel;
