import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String, required: true },
        category: {
          type: String,
          // type: mongoose.Schema.Types.ObjectId,
          // ref: "Category",
          required: true,
        },
        wood: {
          type: String,
          // type: mongoose.Schema.Types.ObjectId,
          // ref: "Wood",
          required: true,
        },
        length: { type: Number, required: true },
        breadth: { type: Number, required: true },
        height: { type: Number, required: true },
        image: { type: [String] },
        description: { type: String },
        price: { type: Number },
        quantity: { type: Number, default: 1 },
        color: { type: String },
        coating: { type: String },
        numberOfDrawers: { type: Number },
        numberOfCabinets: { type: Number },
        handleType: { type: String },
        legStyle: { type: String },
        isCustom: { type: Boolean, default: false },
      },
    ],
    address: { type: Object, required: true },
    amount: { type: Number, required: true },

    payment: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "processing", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      default: "Pending",
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    refundAmount: { type: Number, default: 0 },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.model("Order", orderSchema) || mongoose.models.order;
export default orderModel;
