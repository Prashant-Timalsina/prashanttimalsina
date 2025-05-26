import User from "../models/userModel.js";
// import  Product  from "../models/productModel.js";

// Add to Favorites
export const addToFavorites = async (req, res) => {
  try {
    const userId = req.user.id; // Get logged-in user's ID
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // if (user.favorites.includes(productId)) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Product already in favorites" });
    // }

    user.favorites.push(productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from Favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.favorites = user.favorites.filter((id) => id.toString() !== productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User's Favorite Products
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("favorites"); // Fetch product details
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
