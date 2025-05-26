import feedbackModel from "../models/feedbackModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// Add feedback for a product
export const addFeedback = async (req, res) => {
  try {
    const { productId, rating, review } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!productId || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if rating is valid
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Create new feedback
    const newFeedback = new feedbackModel({
      userId,
      productId,
      rating,
      review,
    });

    // Save feedback
    await newFeedback.save();

    // Add feedback to user's feedback array
    await userModel.findByIdAndUpdate(userId, {
      $push: {
        feedback: {
          productId,
          rating,
          review,
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Feedback added successfully",
      feedback: newFeedback,
    });
  } catch (error) {
    console.error("Error adding feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all feedback for a product
export const getProductFeedback = async (req, res) => {
  try {
    const { productId } = req.params;

    const feedback = await feedbackModel
      .find({ productId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRatings = feedback.length;
    const sumRatings = feedback.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    return res.status(200).json({
      success: true,
      feedback,
      averageRating,
      totalRatings,
    });
  } catch (error) {
    console.error("Error getting product feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get user's feedback for a product
export const getUserProductFeedback = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const feedback = await feedbackModel.findOne({
      userId,
      productId,
    });

    return res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Error getting user feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update feedback
export const updateFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!rating || !review) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if rating is valid
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Find and update feedback
    const feedback = await feedbackModel.findOneAndUpdate(
      { _id: feedbackId, userId },
      { rating, review },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    // Update feedback in user's feedback array
    await userModel.updateOne(
      { _id: userId, "feedback.productId": feedback.productId },
      {
        $set: {
          "feedback.$.rating": rating,
          "feedback.$.review": review,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      feedback,
    });
  } catch (error) {
    console.error("Error updating feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete feedback
export const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const userId = req.user.id;

    // Find and delete feedback
    const feedback = await feedbackModel.findOneAndDelete({
      _id: feedbackId,
      userId,
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found or unauthorized",
      });
    }

    // Remove feedback from user's feedback array
    await userModel.updateOne(
      { _id: userId },
      { $pull: { feedback: { productId: feedback.productId } } }
    );

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
