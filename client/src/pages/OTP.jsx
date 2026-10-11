import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { otpVerification, resetAuthSlice } from "../store/slices/authSlice.js";

const OTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const handleOtpVerification = (e) => {
    e.preventDefault();
    dispatch(otpVerification({ email, otp }));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }

    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message, loading, isAuthenticated, navigateTo]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen">
        
        {/* Left Side */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 relative">
          <Link
            to="/register"
            className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-28 hover:bg-black hover:text-white transition duration-300 text-end"
          >
            Back
          </Link>

          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-12">
              <div className="rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" className="h-24 w-auto" />
              </div>
            </div>

            <h1 className="text-4xl font-medium text-center mb-12 overflow-hidden">
              Check Your Mailbox
            </h1>

            <p className="text-gray-800 text-center mb-12">
              Please enter the OTP to proceed
            </p>

            <form onSubmit={handleOtpVerification}>
              <div className="mb-4">
                <input
                  type="number"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="OTP"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="border-2 mt-5 border-black w-full font-semibold bg-black text-white p-4 py-3 rounded-lg hover:bg-white hover:text-black transition"
              >
                Verify
              </button>
            </form>
          </div>
        </div>

        {/* The right side */}
        <div className="hidden w-full md:w-1/2 md:flex flex-col items-center justify-center bg-black  text-white p-8 rounded-tl-[80px] rounded-bl-[80px]">
          <div className="text-center h-[400px]">
            <div className="flex justify-center mb-12">
              <img
                src={logo_with_title}
                alt="logo"
                className="mb-12 h-44 w-auto"
              />
            </div>

            <p className="text-gray-300 mb-12 text-center">
              New to our platform? Sign Up Now
            </p>
            <Link
              to="/register"
              className="border-2 mt-5 border-white w-full rounded-lg font-semibold py-3 px-8 bg-black text-white hover:bg-white hover:text-black transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTP;
