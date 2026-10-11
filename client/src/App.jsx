import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {ToastContainer} from "react-toastify"

// Pages Imports
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import OTP from './pages/OTP';
import ResetPassword from './pages/ResetPassword';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getUser } from './store/slices/authSlice.js';
import { fetchAllUsers } from './store/slices/userSlice.js';
import { fetchAllBooks } from './store/slices/bookSlice.js';
import { fetchUserBorrowedBooks } from './store/slices/borrowSlice.js';

const App = () => {

  const {user, isAuthenticated} = useSelector((state)=> state.auth);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getUser());
    dispatch(fetchAllBooks());

    if(isAuthenticated && user?.role === "Admin"){
      dispatch(fetchAllUsers());
    }

    if(isAuthenticated && user?.role === "User"){
      dispatch(fetchUserBorrowedBooks);
    }


  },[isAuthenticated])

  return (
    <Router>
      <Routes>
        {/* <Route path="/home" element={<Home/>}/> */}
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/otp-verification/:email" element={<OTP />} />
        <Route path="/password/forgot" element={<ForgotPassword/>}/>
        <Route path="/password/reset/:token" element={<ResetPassword/>}/>
      </Routes>
      <ToastContainer theme="dark"/>
    </Router>
  )
};

export default App;
