import cron from "node-cron";
import {
  sendPaymentReminder,
  autoCancelPendingOrders,
} from "../controllers/orderController.js";

// Run payment reminder check every hour
cron.schedule("0 * * * *", async () => {
  console.log("Running payment reminder check...");
  await sendPaymentReminder();
});

// Run auto-cancellation check every hour
cron.schedule("0 * * * *", async () => {
  console.log("Running auto-cancellation check...");
  await autoCancelPendingOrders();
});

export default cron;
