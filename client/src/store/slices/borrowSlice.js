import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    loading: false,
    error: null,
    userBorrowedBooks: [],
    allBorrowedBooks: [],
    message: null,
  },
  reducers: {
    fetchUserBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchUserBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.userBorrowedBooks = action.payload;
    },
    fetchUserBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    recordBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    recordBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    recordBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    fetchAllBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchAllBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.allBorrowedBooks = action.payload;
    },
    fetchAllBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    returnBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    returnBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    returnBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    resetBorrowSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

// Fetch books borrowed by current logged-in user
export const fetchUserBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchUserBorrowedBooksRequest());
  await axios
    .get("http://localhost:4000/api/v1/borrow/my-borrowed-books", {
      withCredentials: true,
    })
    .then((response) => {
      dispatch(
        borrowSlice.actions.fetchUserBorrowedBooksSuccess(
          response.data.borrowedBooks
        )
      );
    })
    .catch((error) => {
      dispatch(
        borrowSlice.actions.fetchUserBorrowedBooksFailed(
          error.response.data.message
        )
      );
    });
};

// Fetch all borrowed books (Admin only)
export const fetchAllBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchAllBorrowedBooksRequest());
  await axios
    .get("http://localhost:4000/api/v1/borrow/borrowed-books-by-users", {
      withCredentials: true,
    })
    .then((response) => {
      dispatch(
        borrowSlice.actions.fetchAllBorrowedBooksSuccess(
          response.data.borrowedBooks
        )
      );
    })
    .catch((error) => {
      dispatch(
        borrowSlice.actions.fetchAllBorrowedBooksFailed(
          error.response.data.message
        )
      );
    });
};

// Record/borrow a book for a user (Admin only)
export const recordBorrowBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.recordBookRequest());
  await axios
    .post(
      `http://localhost:4000/api/v1/borrow/record-borrow-book/${id}`,
      { email },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      dispatch(borrowSlice.actions.recordBookSuccess(response.data.message));
    })
    .catch((error) => {
      dispatch(
        borrowSlice.actions.recordBookFailed(error.response.data.message)
      );
    });
};

// Return a borrowed book (Admin only)
export const returnBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.returnBookRequest());
  await axios
    .put(
      `http://localhost:4000/api/v1/borrow/return-borrowed-book/${id}`,
      { email },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      dispatch(borrowSlice.actions.returnBookSuccess(response.data.message));
    })
    .catch((error) => {
      dispatch(
        borrowSlice.actions.returnBookFailed(error.response.data.message)
      );
    });
};

// Reset borrow slice state
export const resetBorrowSlice = () => (dispatch) => {
  dispatch(borrowSlice.actions.resetBorrowSlice());
};

export default borrowSlice.reducer;