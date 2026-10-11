import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js"
import popupReducer from './slices/popUpSlice.js'
import userReducer from "./slices/userSlice.js";
import borrowReducer from './slices/borrowSlice.js';
import bookReducer from "./slices/bookSlice.js";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        popup: popupReducer,
        user: userReducer,
        borrow: borrowReducer,
        book: bookReducer

    }
    
});