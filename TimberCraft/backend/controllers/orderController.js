import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import sendEmail from "../utils/emailService.js";
import ApiFeature from "../utils/ApiFeature.js";

import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

// Make sure uploads folder exists
const ensureUploadsDir = () => {
  const dir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const orderData = {
      orderId: uuidv4(),
      userId,
      items,
      address,
      amount,
      paymentMethod: "physical",
      payment: 0,
      date: new Date(),
      status: "pending",
    };

    const order = new orderModel(orderData);
    await order.save();

    await userModel.findByIdAndUpdate(userId, { cartData: [] });

    const subject = "Order Confirmation - TimberCraft";
    const message = `
Dear ${user.name},

Thank you for placing an order with TimberCraft!

Your order details:
- Order ID: ${order._id}
- Total Amount: NRs. ${amount}
- Status: Pending (awaiting approval)
- Delivery Address: ${address.street}, ${address.city}, ${address.zipcode}
- Payment Method: Payment (Pending)

We will process your order shortly. You will receive updates as your order moves through different stages.

If you have any questions, feel free to contact our support team.

Best regards,  
TimberCraft Team
    `;

    await sendEmail(user.email, subject, message);

    res.status(201).json({
      success: true,
      message: "Order placed successfully. Email sent!",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Fetch all orders
export const allOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const orders = await orderModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("userId", "name email");

    const totalOrders = await orderModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      orders,
      totalOrders,
      currentPage: Number(page),
      totalPages: Math.ceil(totalOrders / limit),
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: Get their own orders (paginated)
export const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const resultPerPage = Number(req.query.limit) || 5;
    const currentPage = Number(req.query.page) || 1;
    const status = req.query.status;
    const paymentStatus = req.query.paymentStatus;

    // Build filter object
    const filter = { userId };
    if (status && status !== "all") {
      filter.status = status;
    }
    if (paymentStatus && paymentStatus !== "all") {
      // Convert paymentStatus to proper case for comparison
      const formattedPaymentStatus =
        paymentStatus.charAt(0).toUpperCase() +
        paymentStatus.slice(1).toLowerCase();
      filter.paymentStatus = formattedPaymentStatus;
    }

    const totalOrders = await orderModel.countDocuments(filter);

    const orders = await orderModel
      .find(filter)
      .sort({ date: -1 })
      .skip(resultPerPage * (currentPage - 1))
      .limit(resultPerPage)
      .populate("items.category")
      .populate("items.wood");

    res.status(200).json({
      success: true,
      orders,
      totalOrders,
      currentPage,
      totalPages: Math.ceil(totalOrders / resultPerPage),
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Update order status
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    console.log(
      "Received status update request for order:",
      orderId,
      "with status:",
      status
    );

    const validStatuses = ["pending", "approved", "processing", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await orderModel
      .findById(orderId)
      .populate("userId", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ⚠️ Guard: Don't allow setting to delivered if payment is pending
    if (
      status === "delivered" &&
      order.paymentStatus.toLowerCase() === "pending"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot mark as delivered. Payment is still pending.",
      });
    }

    // 🚫 No need to update if status is already same
    if (order.status === status) {
      return res.status(200).json({
        success: true,
        message: "Status is already set to the requested value.",
        order,
      });
    }

    // Set approvedAt timestamp when status changes to approved
    if (status === "approved") {
      order.approvedAt = new Date();
    }

    order.status = status;
    await order.save();

    const subject = `Order Status Update: ${status}`;
    const message = `
Hello ${order.userId.name},

Your order (ID: ${order._id}) status has been updated to "${status}".

Thank you for shopping with us!
TimberCraft Team
    `;

    await sendEmail(order.userId.email, subject, message);

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to calculate refund amount
const calculateRefundAmount = (order) => {
  const totalAmount = order.amount;
  const nonRefundableAmount = totalAmount * 0.2; // 20% of total amount
  const currentPayment = order.payment || 0;

  if (currentPayment <= nonRefundableAmount) {
    return 0; // No refund if payment is less than or equal to 20%
  }

  return currentPayment - nonRefundableAmount; // Refund amount minus 20%
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await orderModel
      .findOne({ _id: orderId })
      .populate("userId", "name email");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (["delivered", "cancelled"].includes(order.status)) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot cancel this order" });
    }

    let refundAmount = 0;
    let nonRefundableAmount = 0;
    let message = "";

    if (order.status === "processing") {
      // For processing orders, keep 20% of total amount
      nonRefundableAmount = Number((order.amount * 0.2).toFixed(2));
      order.payment = nonRefundableAmount; // Set payment to 20% of total amount
      message = `
Hello ${order.userId.name},

Your order (ID: ${order._id}) has been cancelled.

Order Details:
- Order ID: ${order._id}
- Total Amount: ${Number(order.amount).toFixed(2)}
- Non-refundable Amount (20%): ${nonRefundableAmount}
- Final Payment Retained: ${nonRefundableAmount}

Note: As per our policy, 20% of the total amount (${nonRefundableAmount}) is non-refundable for orders in processing stage.

If this was a mistake or you have any concerns, feel free to contact our support team.

Best regards,  
TimberCraft Team
      `;
    } else {
      // For other statuses (pending, approved), reset payment to 0
      order.payment = 0;
      message = `
Hello ${order.userId.name},

Your order (ID: ${order._id}) has been cancelled.

Order Details:
- Order ID: ${order._id}
- Total Amount: ${Number(order.amount).toFixed(2)}
- Payment Status: Reset to 0.00

If this was a mistake or you have any concerns, feel free to contact our support team.

Best regards,  
TimberCraft Team
      `;
    }

    // Update order status and payment
    order.status = "cancelled";
    order.paymentStatus = "Pending"; // Reset payment status
    await order.save();

    await sendEmail(
      order.userId.email,
      "Order Cancelled - TimberCraft",
      message
    );

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
      nonRefundableAmount: nonRefundableAmount || 0,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Function to handle payment status update and cancellation
export const handlePaymentAndCancellation = async (orderId) => {
  try {
    const order = await orderModel.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const totalAmount = order.amount;
    const nonRefundableAmount = totalAmount * 0.2; // 20% of total amount
    const currentPayment = order.payment || 0;

    // If payment is more than 20%, set it to 20%
    if (currentPayment > nonRefundableAmount) {
      order.payment = nonRefundableAmount;
    }

    // Update payment status to paid if it was pending
    if (order.paymentStatus === "Pending") {
      order.paymentStatus = "Paid";
    }

    // Cancel the order
    order.status = "cancelled";
    order.refundAmount = 0; // No refund as payment is kept at 20%

    await order.save();

    // Send email notification
    const subject = "Order Cancelled - Payment Adjustment";
    const message = `
Hello ${order.userId.name},

Your order (ID: ${order._id}) has been cancelled.

Order Details:
- Order ID: ${order._id}
- Total Amount: ${order.amount}
- Adjusted Payment: ${order.payment}
- Non-refundable Amount (20%): ${nonRefundableAmount}

Note: As per our policy, 20% of the total amount (${nonRefundableAmount}) has been retained as a non-refundable deposit.

If you have any questions, please contact our support team.

Best regards,
TimberCraft Team
    `;

    await sendEmail(order.userId.email, subject, message);

    return order;
  } catch (error) {
    console.error("Error in handlePaymentAndCancellation:", error);
    throw error;
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, payment } = req.body;

    const order = await orderModel
      .findById(orderId)
      .populate("userId", "name email");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (payment > order.amount) {
      return res.status(400).json({
        success: false,
        message: "Payment cannot exceed order total",
      });
    }

    // Update payment amount
    order.payment = Number(payment);

    // Update payment status based on payment amount
    if (order.payment === 0) {
      order.paymentStatus = "Pending";
    } else if (order.payment < order.amount) {
      order.paymentStatus = "Partial";
    } else if (order.payment >= order.amount) {
      order.paymentStatus = "Paid";
    }

    // Save the updated order
    await order.save();

    // Try to send email notification, but don't let it fail the payment update
    try {
      if (order.userId && order.userId.email) {
        const subject = "Payment Status Update - TimberCraft";
        const message = `
Dear ${order.userId.name},

Your payment status for order (ID: ${order._id}) has been updated.

Order Details:
- Order ID: ${order._id}
- Total Amount: ${order.amount}
- Payment Made: ${order.payment}
- Payment Status: ${order.paymentStatus}

Thank you for your business!

Best regards,
TimberCraft Team
        `;

        await sendEmail(order.userId.email, subject, message);
      }
    } catch (emailError) {
      console.error("Error sending payment update email:", emailError);
      // Don't throw the error, just log it
    }

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching order:", id);

    const order = await orderModel.findById(id);
    if (!order) {
      console.log("Order not found:", id);
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    console.log("Order found:", order);
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const placeCustomOrder = async (req, res) => {
  try {
    const { orderId, items, address, amount } = req.body;
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    ensureUploadsDir();

    const processedItems = await Promise.all(
      items.map(async (item, index) => {
        if (item.images && Array.isArray(item.images)) {
          return {
            ...item,
            image: item.images, // Store all images in the image array
          };
        }
        return item;
      })
    );

    const orderData = {
      orderId: uuidv4(),
      userId,
      items: processedItems,
      address,
      amount: Number(amount),
      paymentMethod: "physical",
      payment: 0,
      date: new Date(),
      status: "pending",
    };

    const order = new orderModel(orderData);
    await order.save();

    const firstItem = items[0];

    const subject = "Custom Order Confirmation - TimberCraft";
    const message = `
Dear ${user.name},

Thank you for placing a custom order with TimberCraft!

Your order details:
- Order ID: ${order._id}
- Total Amount: NRs. ${order.amount}
- Status: Pending (awaiting approval)
- Delivery Address: ${address.street}, ${address.city}, ${address.zipcode}

Custom Product Details:
- Description: ${firstItem.name}
- Dimensions: ${firstItem.length} x ${firstItem.breadth} x ${firstItem.height}
- Category: ${firstItem.category}
- Wood Type: ${firstItem.wood}
- Quantity: ${firstItem.quantity}
${firstItem.color ? `- Color: ${firstItem.color}` : ""}
${firstItem.coating ? `- Coating: ${firstItem.coating}` : ""}
${
  firstItem.numberOfDrawers
    ? `- Number of Drawers: ${firstItem.numberOfDrawers}`
    : ""
}
${
  firstItem.numberOfCabinets
    ? `- Number of Cabinets: ${firstItem.numberOfCabinets}`
    : ""
}
${firstItem.handleType ? `- Handle Type: ${firstItem.handleType}` : ""}
${firstItem.legStyle ? `- Leg Style: ${firstItem.legStyle}` : ""}

We will process your order shortly. You will receive updates as your order moves through different stages.

If you have any questions, feel free to contact our support team.

Best regards,  
TimberCraft Team
    `;

    await sendEmail(user.email, subject, message);

    res.status(201).json({
      success: true,
      message: "Custom order placed successfully. Email sent!",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to send payment reminder after 24 hours
export const sendPaymentReminder = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    const pendingOrders = await orderModel
      .find({
        status: "approved",
        paymentStatus: "Pending",
        approvedAt: { $lte: twentyFourHoursAgo },
      })
      .populate("userId", "name email");

    for (const order of pendingOrders) {
      const subject = "Payment Reminder - TimberCraft";
      const message = `
Dear ${order.userId.name},

This is a reminder that your order (ID: ${order._id}) is awaiting payment.
The total amount due is ${order.amount}.

Please complete your payment within the next 24 hours to avoid order cancellation.

Thank you for your prompt attention to this matter.

Best regards,
TimberCraft Team
      `;

      await sendEmail(order.userId.email, subject, message);
    }
  } catch (error) {
    console.error("Error sending payment reminders:", error);
  }
};

// Function to auto-cancel orders after 48 hours of pending payment
export const autoCancelPendingOrders = async () => {
  try {
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48 hours ago

    const pendingOrders = await orderModel
      .find({
        status: "approved",
        paymentStatus: "Pending",
        approvedAt: { $lte: fortyEightHoursAgo },
      })
      .populate("userId", "name email");

    for (const order of pendingOrders) {
      order.status = "cancelled";
      await order.save();

      const subject = "Order Cancelled - Payment Not Received";
      const message = `
Dear ${order.userId.name},

We regret to inform you that your order (ID: ${order._id}) has been automatically cancelled due to non-payment within the 48-hour window.

Order Details:
- Order ID: ${order._id}
- Total Amount: ${order.amount}
- Reason for Cancellation: Payment not received within 48 hours of approval

If you would like to place a new order, please visit our website.

Best regards,
TimberCraft Team
      `;

      await sendEmail(order.userId.email, subject, message);
    }
  } catch (error) {
    console.error("Error auto-cancelling orders:", error);
  }
};
