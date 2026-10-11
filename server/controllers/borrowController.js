import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";



export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // Book ID from URL
  const { email } = req.body; // User's email who is borrowing the book

  // 1. Find the book
  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  // 2. Find the user and ensure their account is verified
  const user = await User.findOne({ email, accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // 3. Check if the book is in stock
  if (book.quantity === 0) {
    return next(new ErrorHandler("Book not available", 400));
  }

  // 4. Check if the user has already borrowed this specific book and hasn't returned it
  const isAlreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === id && b.returned === false
  );
  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("Book already borrowed", 400));
  }

  // 5. Update book quantity & availability
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  // 6. Set the due date (e.g., 7 days from now)
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 7. Push the book into the User's personal borrowedBooks array
  user.borrowedBooks.push({
    bookId: book._id,
    title: book.title,
    borrowedDate: new Date(),
    dueDate: dueDate,
  });
  await user.save();

  // 8. Create the master Borrow record in the database
  await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    bookId: book._id,
    price: book.price,
    dueDate: dueDate,
  });

  // 9. Send success response
  res.status(200).json({
    success: true,
    message: "Borrowed book recorded successfully",
  });
});



export const returnBorrowBook = catchAsyncErrors(async (req, res, next) => {
  // 1. Get the book ID from the URL and the user's email from the request body
  const { bookId } = req.params;
  const { email } = req.body;

  // 2. Find the book and the user in the database
  const book = await Book.findById(bookId);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // 3. Find this specific active borrow record inside the User's personal array
  const borrowedBook = user.borrowedBooks.find(
    (b) => b.bookId.toString() === bookId && b.returned === false
  );

  if (!borrowedBook) {
    return next(new ErrorHandler("You have not borrowed this book", 400));
  }

  // 4. Mark the book as returned inside the User's profile
  borrowedBook.returned = true;
  await user.save();

  // 5. Add the book back to the library's physical inventory
  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  // 6. Find the master transaction record in the 'Borrow' collection
  // Notice the use of quotes "user.email" to search inside a nested object
  const borrow = await Borrow.findOne({
    "user.email": email,
    bookId,
    returnDate: null, // Ensures we are closing an active transaction
  });

  if (!borrow) {
    return next(new ErrorHandler("You have not borrowed this book", 400));
  }

  // 7. Stamp the return date
  borrow.returnDate = new Date();

  // 8. Calculate the fine (if the book is late) using the utility function
  const fine = calculateFine(borrow.dueDate);
  borrow.fine = fine;

  await borrow.save();

  // 9. Send a dynamic response based on whether a fine was applied
  if (fine !== 0) {
    return res.status(200).json({
      success: true,
      message: `The book has been returned successfully. The total charges including a fine are $${fine + book.price}`,
    });
  } else {
    return res.status(200).json({
      success: true,
      message: `The book has been returned successfully. The total charges are $${book.price}`,
    });
  }
});


// 1. Get a User's Own Borrowed Books
export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
  // Extract the borrowed books array directly from the authenticated user's profile
  const borrowedBooks = req.user.borrowedBooks;

  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});



// 2. Admin: Get All Borrowed Books from the Entire System
export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
  // Fetch every single transaction from the master Borrow collection
  const borrowedBooks = await Borrow.find();

  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});



