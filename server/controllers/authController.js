import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplate.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";
import { User } from "../models/userModel.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  // 1. Check if all required fields are provided
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  // 2. Check if a verified user with this email already exists
  const isRegistered = await User.findOne({ email, accountVerified: true });
  if (isRegistered) {
    return next(new ErrorHandler("User already exists", 400));
  }

  // 3. Limit registration attempts to prevent spam (max 5 unverified attempts)
  const registrationAttemptsByUser = await User.find({
    email,
    accountVerified: false,
  });
  if (registrationAttemptsByUser.length >= 5) {
    return next(
      new ErrorHandler(
        "You have exceeded the number of registration attempts. Please contact support",
        400,
      ),
    );
  }

  // 4. Validate password length
  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters", 400),
    );
  }

  // 5. Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 6. Create the new user in the database
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // 7. Generate OTP verification code (Custom method added to userSchema later)
  const verificationCode = await user.generateVerificationCode();

  // Save the generated code and expiry to the user document
  await user.save();

  // 8. Send the verification code via email (Function built later in the video)
  sendVerificationCode(verificationCode, email, res);
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Email and OTP is missing", 400));
  }

  try {
    // Find all unverified entries for this email and sort them in descending order (latest first)
    const userAllEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });

    // If no entry is found, it means the user never registered
    if (!userAllEntries || userAllEntries.length === 0) {
      return next(new ErrorHandler("User not found", 404));
    }

    let user;

    // If the user requested an OTP multiple times, keep the latest one and delete the older duplicate entries
    if (userAllEntries.length > 1) {
      user = userAllEntries[0];
      await User.deleteMany({
        _id: { $ne: user._id }, // Delete everything EXCEPT the latest entry's ID
        email,
        accountVerified: false,
      });
    } else {
      user = userAllEntries[0];
    }

    // Compare the provided OTP with the OTP saved in the database
    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP", 400));
    }

    // Check if the OTP is expired
    const currentTime = Date.now();
    const verificationCodeExpire = new Date(
      user.verificationCodeExpire,
    ).getTime();

    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP Expired", 400));
    }

    // If everything is correct, mark the account as verified and clear the OTP fields
    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;

    // Save the user (validateModifiedOnly: true ensures we don't trigger validation on unchanged fields like password)
    await user.save({ validateModifiedOnly: true });

    // Generate the token and login the user
    sendToken(user, 200, "Account Verified Successfully", res);
  } catch (error) {
    return next(new ErrorHandler("Internal Server Error", 500));
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if both email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  // 2. Find the user by email and ensure their account is verified
  // We use .select("+password") because the password field has 'select: false' in the schema
  const user = await User.findOne({
    email,
    accountVerified: true,
  }).select("+password");

  // 3. If user is not found
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  // 4. Compare the entered password with the hashed password in the database
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  // 5. If passwords do not match
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  // 6. Send the token and log the user in
  sendToken(user, 200, "User Logged In Successfully", res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()), // Expires the cookie immediately
      httpOnly: true,
      secure: true,
      sameSite: "None", // Ensures it matches the security settings of the login cookie
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  // Get the user data that was attached to the request by the isAuthenticated middleware
  const user = req.user;

  // Send the user data back to the frontend
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  // 1. Check if email was provided in the request
  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  // 2. Find the user by email and ensure their account is verified
  const user = await User.findOne({
    email,
    accountVerified: true,
  });

  // 3. If user is not found, return an error
  if (!user) {
    return next(new ErrorHandler("Invalid email", 400));
  }

  // 4. Generate the reset password token (Custom method added to User model next)
  const resetToken = user.getResetPasswordToken();

  // 5. Save the generated token and expiration date to the user document
  // validateBeforeSave: false ensures we don't trigger Mongoose validation on other required fields
  await user.save({ validateBeforeSave: false });

  // 6. Create the Reset Password URL that will be emailed to the user
  const resetPasswordURL = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  // 7. Generate the HTML email template
  const message = generateForgotPasswordEmailTemplate(resetPasswordURL);

  try {
    // 8. Send the email using the utility function created earlier
    await sendEmail({
      email: user.email,
      subject: "BookWorm Library Management System - Password Recovery",
      message: message,
    });

    // 9. Send success response
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    // 10. If the email fails to send, clear the tokens from the database so they aren't left active
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // 1. Get the raw token from the URL parameters
  const { token } = req.params;

  // 2. Hash the raw token from the URL so we can compare it to the hashed version in the DB
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // 3. Find the user based on the hashed token AND ensure the token hasn't expired yet ($gt = greater than)
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // 4. If no user is found, the token is either invalid or expired
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired",
        400,
      ),
    );
  }

  // 5. Ensure the new password and confirm password match
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and Confirm Password do not match", 400),
    );
  }

  // 6. Validate the length of the new passwords
  if (
    req.body.password.length < 8 ||
    req.body.password.length > 16 ||
    req.body.confirmPassword.length < 8 ||
    req.body.confirmPassword.length > 16
  ) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters", 400),
    );
  }

  // 7. Hash the new password using bcrypt
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // 8. Update the user's password with the new hashed password
  user.password = hashedPassword;

  // 9. Clear the reset token fields since they are no longer needed
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // 10. Save the updated user to the database
  await user.save();

  // 11. Automatically log the user in by generating a new token and sending the response
  sendToken(user, 200, "Password Updated Successfully", res);
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  // 1. Find the logged-in user in the database
  // We use req.user._id which is available because of the isAuthenticated middleware
  // We MUST use .select("+password") because the password field is hidden by default in the schema
  const user = await User.findById(req.user._id).select("+password");

  // 2. Destructure the required fields from the request body
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  // 3. Check if all fields are provided
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  // 4. Check if the current password provided matches the one saved in the database
  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Current password is incorrect", 400));
  }

  // 5. Validate the length of the new passwords
  if (
    newPassword.length < 8 ||
    newPassword.length > 16 ||
    confirmNewPassword.length < 8 ||
    confirmNewPassword.length > 16
  ) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters", 400),
    );
  }

  // 6. Ensure the new password and confirm new password match
  if (newPassword !== confirmNewPassword) {
    return next(
      new ErrorHandler(
        "New password and confirm new password do not match",
        400,
      ),
    );
  }

  // 7. Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 8. Update the user's password with the new hashed password
  user.password = hashedPassword;

  // 9. Clear reset token fields (just as a safety measure in case a reset was previously requested)
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // 10. Save the updated user to the database
  await user.save();

  // 11. Send a success response
  res.status(200).json({
    success: true,
    message: "Password Updated",
  });
});
