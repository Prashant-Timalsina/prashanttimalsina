import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} from "../controllers/favoriteController.js";
// import { user } from "../middleware/authMiddleware.js"; // Ensure user is logged in
import userAuth from "../middlewares/UserAuth.js";

const favRouter = express.Router();

favRouter.post("/add/:productId", userAuth, addToFavorites);
favRouter.delete("/remove/:productId", userAuth, removeFromFavorites);
favRouter.get("/", userAuth, getFavorites);

export default favRouter;
