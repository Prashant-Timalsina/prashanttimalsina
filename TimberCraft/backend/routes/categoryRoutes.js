import express from "express";
import upload from "../middlewares/multer.js";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

// Create a new category
categoryRouter.post(
  "/add",
  upload.fields([{ name: "image", maxCount: 1 }]), // Renamed for consistency
  createCategory
);

// Get all categories
categoryRouter.get("/all", getAllCategories);

// Get a single category by ID
categoryRouter.get("/single/:id", getCategoryById);

// Update a category by ID
categoryRouter.put(
  "/update/:id",
  upload.fields([{ name: "image", maxCount: 1 }]), // Renamed for consistency
  updateCategory
);

// Delete a category by ID
categoryRouter.delete("/remove/:id", deleteCategory);

export default categoryRouter;
