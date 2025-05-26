import express from "express";

import {
  getAllChats,
  getChatMessages,
  handleChat,
  sendMessage,
} from "../controllers/chatController.js";
import authUser from "../middlewares/UserAuth.js";
import adminAuth from "../middlewares/AdminAuth.js";

const chatRouter = express.Router();

// Define the chat route
chatRouter.post("/", handleChat);
// Admin routes
chatRouter.get("/admin/chats", adminAuth, getAllChats);
chatRouter.get("/admin/chats/:userId", adminAuth, getChatMessages);
chatRouter.post("/admin/send", adminAuth, sendMessage);

// User routes
chatRouter.get("/user/messages", authUser, getChatMessages);
chatRouter.post("/user/send", authUser, sendMessage);

export default chatRouter;
