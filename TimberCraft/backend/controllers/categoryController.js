import categoryModel from "../models/categoryModel.js";
import Category from "../models/categoryModel.js";
import cloudinary from "cloudinary";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const dupCategory = await Category.findOne({ name });
    if (dupCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const image = req.files.image && req.files.image[0];

    let imageURL = null;
    if (image) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
      });
      imageURL = result.secure_url;
    }

    // Prepare the category data
    const categorylist = {
      name,
      description,
      price,
      image: imageURL,
      date: Date.now(),
    };

    const category = new categoryModel(categorylist);
    const savedCategory = await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add category",
      error: error.message,
    });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load categories",
      error: error.message,
    });
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve category",
      error: error.message,
    });
  }
};

// Update a category by ID
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    // Validate required fields
    if (!name || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and price are required",
      });
    }

    // Check for duplicate category name
    const existingCategory = await Category.findOne({
      name,
      _id: { $ne: id },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists",
      });
    }

    // Handle image upload if provided
    let imageURL = null;
    if (req.files && req.files.image && req.files.image[0]) {
      const result = await cloudinary.uploader.upload(req.files.image[0].path, {
        resource_type: "image",
      });
      imageURL = result.secure_url;
    }

    // Prepare update data
    const updateData = {
      name,
      description,
      price: Number(price),
    };

    // Only update image if a new one was uploaded
    if (imageURL) {
      updateData.image = imageURL;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// Delete a category by ID
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
