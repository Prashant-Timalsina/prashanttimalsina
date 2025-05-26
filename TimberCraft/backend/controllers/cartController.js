import userModel from "../models/userModel.js";
import categoryModel from "../models/categoryModel.js";
import woodModel from "../models/WoodModel.js";
import { Types } from "mongoose";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No user found" });
    }

    const { itemId, length, breadth, height } = req.body;
    const userID = req.user.id || req.user._id;

    if (!itemId || !length || !breadth || !height) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const user = await userModel.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Ensure cartData is an array
    if (!Array.isArray(user.cartData)) {
      user.cartData = []; // Reset to an empty array if it's not an array
    }

    // Find if the item exists in the cart
    const existingItem = user.cartData.find(
      (item) =>
        item.itemId === itemId &&
        item.length === length &&
        item.breadth === breadth &&
        item.height === height
    );

    if (existingItem) {
      existingItem.quantity += 1; // Increase quantity if item exists
    } else {
      user.cartData.push({ itemId, length, breadth, height, quantity: 1 }); // Add as new item
    }

    await user.save();
    res.status(200).json({ success: true, message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE CART
export const updateCart = async (req, res) => {
  try {
    const { itemId, length, breadth, height, quantity } = req.body;
    const userId = req.user.id;

    if (
      !itemId ||
      !length ||
      !breadth ||
      !height ||
      quantity === undefined ||
      quantity === null
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const itemIndex = user.cartData.findIndex(
      (item) =>
        item.itemId === itemId &&
        item.length === length &&
        item.breadth === breadth &&
        item.height === height
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    if (quantity === 0) {
      user.cartData.splice(itemIndex, 1); // ✅ Remove item if quantity is 0
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: "Item removed from cart" });
    } else {
      user.cartData[itemIndex].quantity = quantity; // ✅ Update quantity
    }

    await user.save();
    res.status(200).json({ success: true, message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET CART
export const getCart = async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await userModel.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, cartData: user.cartData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await userModel.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.cartData = [];
    await user.save();
    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customAdd = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No user found" });
    }

    const { description, category, wood, length, breadth, height } = req.body;

    // Validate inputs
    if (!description || !category || !wood || !length || !breadth || !height) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (isNaN(length) || isNaN(breadth) || isNaN(height)) {
      return res
        .status(400)
        .json({ success: false, message: "Dimensions must be valid numbers" });
    }

    // Fetch category and wood data safely
    let categoryData, woodData;
    try {
      categoryData = await categoryModel.findById(category);
      woodData = await woodModel.findById(wood);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid category or wood ID format",
      });
    }

    if (!categoryData || !woodData) {
      return res.status(400).json({
        success: false,
        message: "Invalid category or wood selection",
      });
    }

    // Calculate price
    const dimension = Number(length) * Number(breadth) * Number(height);
    const price = categoryData.price * woodData.price * dimension;

    // Handle image upload (ensure files exist)
    const image1 = req.files?.image1?.[0];
    const images = [image1].filter(Boolean);
    let imagesURL = [];

    if (images.length > 0) {
      imagesURL = await Promise.all(
        images.map(async (item) => {
          if (!item.mimetype.startsWith("image/")) {
            throw new Error("Invalid file type. Only images are allowed.");
          }
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    // Prepare the custom order
    const customOrder = {
      itemId: new Types.ObjectId(), // Generate a new ObjectId for the custom order
      type: "custom",
      description,
      category: categoryData._id,
      wood: woodData._id,
      image: imagesURL,
      length: Number(length),
      breadth: Number(breadth),
      height: Number(height),
      price,
      quantity: 1,
    };

    // Find and update user cart
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await userModel.updateOne(
      { _id: req.user.id },
      { $push: { cartData: customOrder } } // Use MongoDB’s $push operator
    );

    return res
      .status(201)
      .json({ success: true, message: "Custom order added to cart" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
