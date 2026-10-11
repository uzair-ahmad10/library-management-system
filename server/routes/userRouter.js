import express from "express";
import { getAllUsers, registerNewAdmin } from "../controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 1. Get all registered users (Admin only)
router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllUsers);

// 2. Register a new Admin
router.post("/add/new-admin", isAuthenticated, isAuthorized("Admin"), registerNewAdmin);

export default router;