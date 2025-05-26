import Wood from "../models/WoodModel.js"; // Assuming you have a Wood model
import { v2 as cloudinary } from "cloudinary";

export const createWood = async (req, res) => {
  try {
    const { name, description, price, advantages } = req.body;

    // Check if the wood name already exists
    const existingWood = await Wood.findOne({ name });
    if (existingWood) {
      return res.status(400).json({
        success: false,
        message: "Wood name must be unique. This name already exists.",
      });
    }

    // Initialize images array
    const images = [];
    if (req.files) {
      for (let i = 1; i <= 3; i++) {
        const image = req.files[`image${i}`] && req.files[`image${i}`][0];
        if (image) {
          const result = await cloudinary.uploader.upload(image.path, {
            resource_type: "image",
          });
          images.push(result.secure_url);
        }
      }
    }

    // Check if advantages is an array (in case advantages[] is sent from Postman)
    const parsedAdvantages = Array.isArray(advantages)
      ? advantages
      : advantages
      ? advantages.split(",")
      : [];

    // Prepare the wood data
    const woodData = {
      name,
      description,
      images,
      price,
      advantages: parsedAdvantages,
      date: Date.now(),
    };

    // Create a new wood instance and save it
    const wood = new Wood(woodData);
    const savedWood = await wood.save();

    res.status(201).json({
      success: true,
      message: "Wood type created successfully",
      wood: savedWood,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create wood type",
      error: error.message,
    });
  }
};

// Get all wood types
export const getAllWoods = async (req, res) => {
  try {
    const woods = await Wood.find();
    res.status(200).json({
      success: true,
      message: "Woods retrieved successfully",
      woods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve woods",
      error: error.message,
    });
  }
};

// Get a single wood type by ID
export const getWoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const wood = await Wood.findById(id);

    if (!wood) {
      return res.status(404).json({
        success: false,
        message: "Wood type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wood type retrieved successfully",
      wood,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve wood type",
      error: error.message,
    });
  }
};

// Update a wood type by ID
export const updateWood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, advantages } = req.body;

    // Initialize images array for update
    const images = [];
    if (req.files) {
      for (let i = 1; i <= 3; i++) {
        const image = req.files[`image${i}`] && req.files[`image${i}`][0];
        if (image) {
          const result = await cloudinary.uploader.upload(image.path, {
            resource_type: "image",
          });
          images.push(result.secure_url);
        } else {
          images.push(null); // Placeholder for empty images
        }
      }
    }

    // Update wood data
    const updatedWood = await Wood.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        images,
        advantages: advantages ? JSON.parse(advantages) : [],
      },
      { new: true, runValidators: true }
    );

    if (!updatedWood) {
      return res.status(404).json({
        success: false,
        message: "Wood type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wood type updated successfully",
      wood: updatedWood,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update wood type",
      error: error.message,
    });
  }
};

// Delete a wood type by ID
export const deleteWood = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedWood = await Wood.findByIdAndDelete(id);

    if (!deletedWood) {
      return res.status(404).json({
        success: false,
        message: "Wood type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wood type deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete wood type",
      error: error.message,
    });
  }
};
