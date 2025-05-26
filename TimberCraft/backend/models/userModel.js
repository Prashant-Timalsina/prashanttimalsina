import { mongoose } from "mongoose";

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter User name"],
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: [true, "Enter email"],
      unique: [true, "User email already in use"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Enter Password"],
      minLength: [6, "Password should be more than 6 letters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    cartData: {
      type: [
        {
          itemId: String,
          length: Number,
          breadth: Number,
          height: Number,
          quantity: Number,
          description: { type: String, required: false }, // Optional field
          category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: false,
          }, // Optional field
          wood: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wood",
            required: false,
          }, // Optional field
          image: { type: [String], required: false }, // Array of images, optional
          price: { type: Number, required: false }, // Optional field
        },
      ],
      default: [], // ✅ Now cart is an array
    },
    favorites: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      default: [],
    },
    feedback: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
          },
          review: {
            type: String,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    // Add these fields for email verification
    isVerified: {
      type: Boolean,
      default: false, // Initially, email is not verified
    },
    verificationToken: {
      type: String, // Store the verification token here
    },
    // **New fields for reset token functionality**
    resetToken: {
      type: String, // Store the reset token here
      default: null,
    },
    resetTokenExpiry: {
      type: Date, // Store the reset token expiration time here
      default: null,
    },
  },
  {
    minimize: false, // Keeps the empty fields as empty objects
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
