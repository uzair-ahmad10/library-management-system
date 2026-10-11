import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";
import { BookA } from "lucide-react";
import ReadBookPopup from "../popups/ReadBookPopup";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import { fetchAllBooks } from "../store/slices/bookSlice";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks, loading } = useSelector((state) => state.borrow);
  const { readBookPopup } = useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState({});
  const [filter, setFilter] = useState("returned");

  // Fetch borrowed books and books list on component mount
  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
    if (!books || books.length === 0) {
      dispatch(fetchAllBooks());
    }
  }, [dispatch]);

  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${String(date.getFullYear())}`;

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes(),
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

    return `${formattedDate} ${formattedTime}`;
  };

  // Safe checks for boolean or stringified boolean flags from API
  const returnedBooks =
    userBorrowedBooks?.filter((book) => Boolean(book.returned) === true) || [];
  const nonReturnedBooks =
    userBorrowedBooks?.filter((book) => Boolean(book.returned) === false) || [];

  const booksToDisplay =
    filter === "returned" ? returnedBooks : nonReturnedBooks;

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Borrowed Books
          </h2>
        </header>

        <header className="flex flex-col gap-3 sm:flex-row md:items-center mt-4">
          <button
            onClick={() => setFilter("returned")}
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg text-center border-2 font-semibold py-2 px-4 w-full sm:w-72 ${
              filter === "returned"
                ? "bg-black text-white border-black"
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
            }`}
          >
            Returned Books
          </button>
          <button
            onClick={() => setFilter("nonReturned")}
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg text-center border-2 font-semibold py-2 px-4 w-full sm:w-72 ${
              filter === "nonReturned"
                ? "bg-black text-white border-black"
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
            }`}
          >
            Non Returned Books
          </button>
        </header>

        {loading ? (
          <p className="mt-6 text-lg">Loading borrowed books...</p>
        ) : booksToDisplay.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Book Title</th>
                  <th className="p-2 text-left">Date & Time</th>
                  <th className="p-2 text-left">Due Date</th>
                  <th className="p-2 text-left">Returned</th>
                  <th className="p-2 text-left">View</th>
                </tr>
              </thead>
              <tbody>
                {booksToDisplay.map((book, index) => (
                  <tr
                    key={book._id || index}
                    className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{book.bookTitle}</td>
                    <td className="p-2">{formatDate(book.borrowedDate)}</td>
                    <td className="p-2">{formatDate(book.dueDate)}</td>
                    <td className="p-2">{book.returned ? "Yes" : "No"}</td>
                    <td className="p-2">
                      <BookA
                        className="cursor-pointer"
                        onClick={() => openReadPopup(book.bookId)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filter === "returned" ? (
          <h3 className="text-3xl mt-5 font-medium">No Returned Books Found</h3>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">
            No Non-Returned Books Found
          </h3>
        )}
      </main>

      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;