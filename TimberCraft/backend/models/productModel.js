import { mongoose } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter Product Name"],
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Enter Product Price"],
    },
    image: { type: Array, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    wood: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wood",
    },
    // wood: {
    //   type: String,
    //   required: [true, "Add Wood Name"],
    // },
    length: {
      type: Number,
      default: null, // Default to null if not provided
      min: [0, "Length cannot be less than 0"],
    },
    breadth: {
      type: Number,
      default: null, // Default to null if not provided
      min: [0, "Breadth cannot be less than 0"],
    },
    height: {
      type: Number,
      default: null, // Default to null if not provided
      min: [0, "Height cannot be less than 0"],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const productModel =
  mongoose.models.product || mongoose.model("Product", productSchema);
export default productModel;
