// IT DOES NOT WORK
// This script is SUPPOSED to fix the cartData field in the user collection
// by transforming it from an object to an array of objects.

import mongoose from "mongoose";
import userModel from "../models/userModel.js"; // Ensure the correct path

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://prashanttimalsina2:tzNTHHHzwLQKtxNf@furniture.hg0jm.mongodb.net/woods?retryWrites=true&w=majority&appName=furniture",
  {
    useUnifiedTopology: true, // Deprecated, but still works with the current MongoDB driver
  }
);

const fixCartData = async () => {
  try {
    const users = await userModel.find();

    for (let user of users) {
      if (user.cartData && !Array.isArray(user.cartData)) {
        // Transform cartData from object to array
        const newCartData = Object.values(user.cartData).map((item) => ({
          itemId: item.itemId,
          length: item.length,
          breadth: item.breadth,
          height: item.height,
          quantity: item.quantity || 1,
        }));

        // Update the user's cartData to be an array
        user.cartData = newCartData;
        await user.save();
        console.log(`Updated cartData for user: ${user._id}`);
      }
    }

    console.log("Cart data migration complete.");
  } catch (error) {
    console.error("Error migrating cart data:", error);
  } finally {
    mongoose.disconnect();
  }
};

fixCartData();
