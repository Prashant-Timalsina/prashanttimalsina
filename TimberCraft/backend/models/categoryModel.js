import { mongoose } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Enter Category Name"],
    },
    description: {
      type: String,
      required: [true, "Enter Category Description"],
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      required: [true, "Enter Category Price"],
    },
    // isbox: { type: Boolean, default: false },
    // boxCount: {type: Number}
  },
  { timestamps: true }
);

const categoryModel =
  mongoose.models.product || mongoose.model("Category", categorySchema);
export default categoryModel;
