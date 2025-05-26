import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import ApiFeature from "../utils/ApiFeature.js";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      wood,
      length,
      breadth,
      height,
    } = req.body;

    console.log("Request Body:", req.body);

    // Ensure req.files exists and handle the images
    const image1 = req.files?.image1?.[0]; // Check if req.files exists and get the first image
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    // Create an array of images and filter out any undefined entries
    const images = [image1, image2, , image3, image4].filter(Boolean);

    // Validate at least one image is provided
    if (images.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one image",
      });
    }

    // Upload the images to Cloudinary
    let imagesURL = [];
    if (images.length > 0) {
      imagesURL = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    //Prepare the product data
    const productData = {
      name,
      description,
      category,
      price: Number(price),
      wood,
      image: imagesURL,
      length,
      breadth,
      height,
      date: Date.now(),
    };

    //Validate price to be not less than 0
    if (productData.price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be less than 0",
      });
    }

    console.log(productData);

    //Create a new product instance and save it
    const product = new productModel(productData);
    await product.save();

    //Send a response indicating success
    res.status(201).json({ success: true, message: "Product Added" });
  } catch (error) {
    console.error("Error adding product: ", error);

    res.status(500).json({
      success: false,
      message: "Failed to add furniture",
      error: error.message,
    });
  }
};

// Remove a product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product: ", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// Get a single product by ID
const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching product: ", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

const listProduct = async (req, res) => {
  try {
    // Instantiate ApiFeature
    const features = new ApiFeature(productModel.find(), req.query).search(); // Apply search filter if keyword is present

    const products = await features.query; // Get all products based on query

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load products",
      error: error.message,
    });
  }
};

export const listRelatedProduct = async (req, res) => {
  try {
    // Fetch products based on category and wood from query params
    const products = await productModel.find({
      ...(req.query.category && { category: req.query.category }), // Filter by category ID if provided
      ...(req.query.wood && { wood: req.query.wood }), // Filter by wood ID if provided
    });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No related products found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Related products retrieved successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load related products",
      error: error.message,
    });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      wood,
      length,
      breadth,
      height,
    } = req.body;

    // Ensure req.files exists and handle the images
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // Create an array of images and filter out any undefined entries
    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesURL = [];
    if (images.length > 0) {
      imagesURL = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    // Prepare the updated product data
    const updatedProductData = {
      name,
      description,
      category,
      wood,
      image: imagesURL.length > 0 ? imagesURL : undefined,
      length,
      breadth,
      height,
    };

    if (price !== undefined) {
      const numericPrice = Number(price);
      if (isNaN(numericPrice)) {
        return res.status(400).json({
          success: false,
          message: "Invalid price value",
        });
      }
      updatedProductData.price = numericPrice;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updatedProductData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product: ", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct, updateProduct };
