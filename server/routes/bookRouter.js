import express from "express";
import {
  addBook,
  deleteBook,
  getAllBooks,
} from "../controllers/bookController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Only an Admin can add a book
router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);

// Any authenticated user (Admin or User) can view all books
router.get("/all", isAuthenticated, getAllBooks);

// Only an Admin can delete a book
router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);

export default router;