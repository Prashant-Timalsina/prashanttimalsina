import express from "express";
import upload from "../middlewares/multer.js";
import {
  createWood,
  getAllWoods,
  getWoodById,
  updateWood,
  deleteWood,
} from "../controllers/WoodController.js"; // Assuming woodController.js contains the Wood controller functions

const woodRouter = express.Router();

// Create a new wood type (POST request for creating a resource)
woodRouter.post(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  createWood
);

// Update a wood type (PUT request for updating a resource)
woodRouter.put(
  "/update/:id",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  updateWood
);

// Get a single wood type by ID (GET request for reading a resource)
woodRouter.get("/single/:id", getWoodById);

// List all wood types (GET request for reading multiple resources)
woodRouter.get("/all", getAllWoods);

// Delete a wood type (DELETE request for deleting a resource)
woodRouter.delete("/remove/:id", deleteWood);

export default woodRouter;
