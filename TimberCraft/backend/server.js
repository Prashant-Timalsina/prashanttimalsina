import express from "express";
import cors from "cors";
import "dotenv/config.js";
import dbConnect from "./config/dbConnect.js";
import connectCloudinary from "./config/cloudinary.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import userRouter from "./routes/userRoutes.js";
import woodRouter from "./routes/woodRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import sendEmail from "./middlewares/NodeMailer.js";
import orderRouter from "./routes/orderRoutes.js";
import favRouter from "./routes/favoriteRoutes.js";
import feedbackRouter from "./routes/feedbackRoutes.js";
import bodyParser from "body-parser";
// import paymentRouter from "./routes/paymentRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import "./utils/scheduler.js"; // Import the scheduler

import http from "http"; // Import HTTP module
import { Server } from "socket.io"; // Import Socket.IO

const app = express();
const port = process.env.PORT || 4000;

// Initialize database and Cloudinary connections
dbConnect();
connectCloudinary();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json());

app.use(cors());

//Routes
app.post("/send-email", sendEmail);

// API endpoints
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/user", userRouter);
app.use("/api/wood", woodRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/fav", favRouter);
app.use("/api/feedback", feedbackRouter);
// app.use("/api/payment", paymentRouter);

app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

// app.listen(port, () => console.log("Server Started on port: " + port));

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (adjust for production)
    methods: ["GET", "POST"],
  },
});

// Attach Socket.IO instance to the app
app.set("io", io);

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
server.listen(port, () => console.log("Server Started on port: " + port));
