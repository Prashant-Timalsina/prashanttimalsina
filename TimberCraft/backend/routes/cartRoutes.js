import express from "express";
import {
  addToCart,
  updateCart,
  getCart,
  clearCart,
  customAdd,
} from "../controllers/cartController.js";
import authUser from "../middlewares/UserAuth.js";
import upload from "../middlewares/multer.js";

const cartRouter = express.Router();

// Add to cart
cartRouter.post("/add", authUser, addToCart);

// Update cart
cartRouter.put("/update", authUser, updateCart);

// Get cart
cartRouter.get("/get", authUser, getCart);

// custom add to cart
cartRouter.post("/addCustom", authUser, upload.single("image1"), customAdd);

cartRouter.delete("/clear", authUser, clearCart);

export default cartRouter;
