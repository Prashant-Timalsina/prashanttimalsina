import express from "express";
import authUser from "../middlewares/UserAuth.js";
import adminAuth from "../middlewares/AdminAuth.js";
import upload from "../middlewares/multer.js";

import {
  allOrders,
  cancelOrder,
  getOrderById,
  placeOrder,
  placeCustomOrder,
  updatePaymentStatus,
  updateStatus,
  userOrders,
  handlePaymentAndCancellation,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Admin routes
orderRouter.get("/all", adminAuth, allOrders);
orderRouter.put("/status", adminAuth, updateStatus);

// User routes
orderRouter.post("/physical", authUser, placeOrder);
orderRouter.post(
  "/custom",
  authUser,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  placeCustomOrder
);
orderRouter.get("/myorder", authUser, userOrders);
orderRouter.put("/payment", authUser, updatePaymentStatus);
orderRouter.put("/cancel", authUser, cancelOrder);
orderRouter.put("/payment-cancel", authUser, handlePaymentAndCancellation);

// Shared routes (accessible by both users and admins)
orderRouter.get("/:id", authUser, getOrderById);

export default orderRouter;
