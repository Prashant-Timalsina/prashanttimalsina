import express from "express";
import upload from "../middlewares/multer.js";

import {
  addProduct,
  singleProduct,
  listProduct,
  removeProduct,
  updateProduct,
  listRelatedProduct,
} from "../controllers/productController.js";
import adminAuth from "../middlewares/AdminAuth.js";
import authUser from "../middlewares/UserAuth.js";
// import authUser from "../middlewares/UserAuth.js";

const productRouter = express.Router();

// Add a product (POST request for creating a resource)
productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);

// Update a product (PUT request for updating a resource)
productRouter.put(
  "/update/:id",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  updateProduct
);

// Get a single product by ID (GET request for reading a resource)
productRouter.get("/single/:id", singleProduct);

// List all products (GET request for reading multiple resources)
productRouter.get("/list", listProduct);

productRouter.get("/related", listRelatedProduct);

// Remove a product (DELETE request for deleting a resource)
productRouter.delete("/remove/:id", adminAuth, removeProduct);

export default productRouter;
