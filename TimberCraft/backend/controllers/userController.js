import bcrypt from "bcrypt"; // For hashing passwords
import userModel from "../models/userModel.js"; // Import the user model
import jwt from "jsonwebtoken";
import validator from "validator";
import sendEmail from "../utils/emailService.js"; // Adjust path if needed
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "15h" });
};

const passwordValidation = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/;

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (!password.match(passwordValidation)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain an uppercase letter and a number",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate email verification token
    const token = jwt.sign(
      { name, email, password: hashedPassword },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Email verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    // Send verification email
    console.log(email, verificationLink); // Debugging line

    const subject = "Verify your email to complete registration";
    const message = `Hello ${name},
Please click the link below to verify your email and complete your registration:
      ${verificationLink}
This link will expire in 1 hour.`;
    await sendEmail(email, subject, message);

    return res.status(200).json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token)
      return res.status(400).json({ message: "Verification token missing" });

    // Verify token and extract data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { name, email, password } = decoded;

    // Check if user already exists (just in case)
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already verified" });
    }

    const newUser = new userModel({
      name,
      email,
      password,
    });

    await newUser.save();

    // Generate final login token
    const finalToken = createToken(newUser._id, newUser.role);

    return res.status(201).json({
      success: true,
      message: "Account verified and created successfully",
      token: finalToken,
    });
  } catch (error) {
    console.error("Error in verifyUser:", error);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

// LOGIN: Authenticate user and generate token
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input data
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // Find the user by email
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    const token = createToken(user._id, user.role); // Include id and role
    return res.status(200).json({
      success: true,
      message: "Logged in",
      token,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // 🔹 Superadmin Login (Fixed Email & Password)
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email, role: "superadmin" },
        process.env.JWT_SECRET,
        { expiresIn: "15h" }
      );

      return res.status(200).json({
        success: true,
        token,
        role: "superadmin",
      });
    }

    // 🔹 Check if the email exists in the database
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    // 🔹 Ensure the user has admin privileges
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access is not allowed for this account",
      });
    }

    // 🔹 Validate password (check against hashed password)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 🔹 Generate JWT Token for Admin
    const token = jwt.sign(
      { email, role: "admin", userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15h" }
    );

    return res.status(200).json({
      success: true,
      token,
      role: "admin",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const userData = async (req, res) => {
  try {
    const { id } = req.user;

    // Check if the authenticated user matches the ID in the request
    if (req.user.id !== id) {
      return res
        .status(403)
        .json({ message: "You can only access your own data" });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE: Update user details
export const updateUser = async (req, res) => {
  try {
    const { userId, name, email, password } = req.body;
    const avatar = req.files?.image?.[0]; // Check if an image is uploaded

    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let imageURL = user.avatar; // Default to current avatar
    if (avatar) {
      const result = await cloudinary.uploader.upload(avatar.path, {
        resource_type: "image",
      });
      imageURL = result.secure_url;
    }

    // Update user details
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (avatar) user.avatar = imageURL; // Update avatar if provided

    // Save updated user to the database
    const updatedUser = await user.save();

    // Respond with success and the updated user
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// READ: Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).json({ message: "All users", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE: Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 1️⃣ Request Password Reset (Sends Email)
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token & expiration
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 5 * 60 * 1000; // 5 min expiry

    console.log("Generated reset token:", resetToken);
    console.log("Before saving user:", user);

    await user.save();

    // Send reset email
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    await sendEmail(user.email, "Password Reset", `Click here: ${resetLink}`);

    res.json({ success: true, message: "Reset email sent!" });
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Check if password meets the criteria
    if (!passwordValidation.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter and one number",
      });
    }

    console.log("Received token:", token);
    console.log("Checking database for user with this token...");

    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    console.log("Found user:", user);

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear the reset token
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user role (admin <-> user, superadmin can demote admin)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params; // Target user ID
    const actingRole = req.user.role; // Use token role
    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Prevent changing superadmin (if ever present)
    if (user.role === "superadmin") {
      return res
        .status(403)
        .json({ success: false, message: "Cannot change superadmin role." });
    }
    // If user is admin, only superadmin can demote to user
    if (user.role === "admin") {
      if (actingRole !== "superadmin") {
        return res.status(403).json({
          success: false,
          message: "Only superadmin can demote admin to user.",
        });
      }
      user.role = "user";
    } else if (user.role === "user") {
      // Both admin and superadmin can promote user to admin
      if (actingRole !== "admin" && actingRole !== "superadmin") {
        return res.status(403).json({
          success: false,
          message: "Not authorized to promote user to admin.",
        });
      }
      user.role = "admin";
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid role switch." });
    }
    await user.save();
    return res.status(200).json({
      success: true,
      message: `User role updated to ${user.role}.`,
      user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
