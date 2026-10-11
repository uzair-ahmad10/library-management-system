import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Redux Actions
import { register, resetAuthSlice } from "../store/slices/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const handleRegister = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);

    dispatch(register(data));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      navigateTo(`/otp-verification/${email}`);
    }

    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, loading, isAuthenticated, message, email, navigateTo]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen overflow-hidden">
        {/* Left Side */}
        <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        
          <div className="text-center flex flex-col items-center max-w-sm">
            <div className="flex justify-center mb-8">
              <img
                src={logo_with_title}
                alt="logo"
                className="h-44 w-auto object-contain"
              />
            </div>
            <p className="text-gray-300 mb-8">
              Already have an account? Sign In Now
            </p>
            <Link
              to="/login"
              className="border-2 rounded-lg font-semibold border-white py-2 px-8 hover:bg-white hover:text-black transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
          <div className="w-full max-w-sm">
            {/* Header: Title & Logo */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <h3 className="font-semibold text-4xl text-black">Sign Up</h3>
              <img
                src={logo}
                alt="logo"
                className="h-10 w-auto object-contain"
              />
            </div>

            {/* Subtitle */}
            <p className="text-gray-500 text-center text-sm mb-8">
              Please provide your information to sign up.
            </p>

            
            <form onSubmit={handleRegister} className="w-full">
              <div className="mb-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none placeholder-gray-500"
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none placeholder-gray-500"
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none placeholder-gray-500"
                  required
                />
              </div>

              {/* Mobile-only Sign In Link */}
              <div className="block md:hidden font-semibold mt-4 text-center">
                <p className="text-sm">Already have an account?</p>
                <Link
                  to="/login"
                  className="text-sm text-gray-500 hover:underline"
                >
                  Sign In
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2.5 rounded-lg hover:bg-white hover:text-black transition uppercase text-sm hover:cursor-pointer"
              >
                SIGN UP
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;