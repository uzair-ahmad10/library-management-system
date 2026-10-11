import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  error: null,
  message: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ---- Registration Actions ----
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    registerFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ---- OTP Verification Actions ----
    otpVerificationRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    otpVerificationSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    otpVerificationFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ---- Login Actions ----
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    loginFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ---- Logout Actions ----
    logoutRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    logoutSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message; // potential threat (action.payload)
      state.user = null;
      state.isAuthenticated = false;
    },
    logoutFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    // ---- Get User Actions ----
    getUserRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    getUserFailed: (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },

    // ---- Forgot Password Actions ----
    forgotPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload; 
    },
    forgotPasswordFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ---- Reset Password Actions ----
    resetPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    resetPasswordFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ---- Update Password Actions ----
    updatePasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updatePasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    updatePasswordFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ---- Utility Action ----
    resetAuthSlice: (state) => {
      state.error = null;
      state.loading = false;
      state.message = null;
    },
  },
});

export const { resetAuthSlice } = authSlice.actions;
export default authSlice.reducer;


// =====================================================================
// ASYNCHRONOUS THUNK FUNCTIONS
// =====================================================================

export const resetAuth = ()=> async(dispatch)=>{
    dispatch(authSlice.actions.resetAuthSlice());
}


export const register = (data) => async (dispatch) => {
  dispatch(authSlice.actions.registerRequest());
  try {
    const response = await axios.post('http://localhost:4000/api/v1/auth/register', data, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    dispatch(authSlice.actions.registerSuccess(response.data));
  } catch (error) {
    dispatch(authSlice.actions.registerFailed(error.response.data.message));
  }
};

export const otpVerification = ({ email, otp }) => async (dispatch) => {
  dispatch(authSlice.actions.otpVerificationRequest());
  try {
    const response = await axios.post('http://localhost:4000/api/v1/auth/verify-otp', { email, otp }, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    dispatch(authSlice.actions.otpVerificationSuccess(response.data));
  } catch (error) {
    dispatch(authSlice.actions.otpVerificationFailed(error.response.data.message));
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(authSlice.actions.loginRequest());
  try {
    const response = await axios.post('http://localhost:4000/api/v1/auth/login', data, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    dispatch(authSlice.actions.loginSuccess(response.data));
  } catch (error) {
    dispatch(authSlice.actions.loginFailed(error.response.data.message));
  }
};

export const logout = () => async (dispatch) => {
  dispatch(authSlice.actions.logoutRequest());
  try {
    const response = await axios.get('http://localhost:4000/api/v1/auth/logout', {
      withCredentials: true,
    });
    dispatch(authSlice.actions.logoutSuccess(response.data));
    dispatch(resetAuthSlice());
  } catch (error) {
    dispatch(authSlice.actions.logoutFailed(error.response.data.message));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(authSlice.actions.getUserRequest());
  try {
    const response = await axios.get('http://localhost:4000/api/v1/auth/me', {
      withCredentials: true,
    });
    dispatch(authSlice.actions.getUserSuccess(response.data));
  } catch (error) {
    dispatch(authSlice.actions.getUserFailed(error.response?.data?.message));
  }
};

export const forgotPassword = ({ email }) => async (dispatch) => {
  dispatch(authSlice.actions.forgotPasswordRequest());
  try {
    const response = await axios.post('http://localhost:4000/api/v1/auth/password/forgot', { email }, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });

    dispatch(authSlice.actions.forgotPasswordSuccess(response.data.message));
  } catch (error) {
    dispatch(authSlice.actions.forgotPasswordFailed(error.response?.data?.message || "Something went wrong"));
  }
};

// Requires both the form data (passwords) and the token from the URL parameters
export const resetPassword = (data, token) => async (dispatch) => {
  dispatch(authSlice.actions.resetPasswordRequest());
  try {
    const response = await axios.put(`http://localhost:4000/api/v1/auth/password/reset/${token}`, data, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    dispatch(authSlice.actions.resetPasswordSuccess(response.data));
  } catch (error) {
    dispatch(authSlice.actions.resetPasswordFailed(error.response.data.message));
  }
};

// Authenticated route for an already logged-in user to update their password
export const updatePassword = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updatePasswordRequest());
  try {
    const response = await axios.put('http://localhost:4000/api/v1/auth/password/update', data, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    dispatch(authSlice.actions.updatePasswordSuccess(response.data));
  } catch (error) {
    dispatch(authSlice.actions.updatePasswordFailed(error.response.data.message));
  }
};