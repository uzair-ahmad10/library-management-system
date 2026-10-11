import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary"; 


// Configure Cloudinary using your exact .env variable names
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});


// 1. Admin: Get All Users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});


// 2. Register New Admin
export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {

  // 1. Configure Cloudinary dynamically inside the function
  // cloudinary.config({
  //   cloud_name: process.env.CLOUDINARY_CLIENT_NAME?.trim(),
  //   api_key: process.env.CLOUDINARY_CLIENT_API?.trim(),
  //   api_secret: process.env.CLOUDINARY_CLIENT_SECRET?.trim(),
  // })



  // 2. Check if files exist

  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return next(new ErrorHandler("All the fields are required.", 400));
  }

  // 3. Check if admin already exists
  const isRegistered = await User.findOne({ email, accountVerified: true });
  if (isRegistered) {
    return next(new ErrorHandler("User already exist", 400));
  }

  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters long.", 400)
    );
  }

  // 4. File validation
  // const { avatar } = req.files;
  // const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  // if (!allowedFormats.includes(avatar.mimetype)) {
  //   return next(new ErrorHandler("File is not Supported.", 400));
  // }

  // 5. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // FIX: Convert file buffer directly to a Data URI (Bypasses temp path issues)
  // const fileUri = `data:${avatar.mimetype};base64,${avatar.data.toString("base64")}`;

  // 6. Cloudinary Upload with safe path detection

  // let cloudinaryResponse;
  // try {
  //   // const fileSource = avatar.tempFilePath || avatar.data;

  //   cloudinaryResponse = await cloudinary.uploader.upload(fileUri, {
  //     folder: "Library_Management_System_Admin_Avatars",
  //     resource_type: "image",
  //   });
  // } catch (cloudErr) {
  //   console.error("CLOUDINARY_UPLOAD_ERROR:", cloudErr);
  //   return next(
  //     new ErrorHandler(
  //       cloudErr.message || "Failed to upload avatar to Cloudinary",
  //       500
  //     )
  //   );
  // }

  // if (!cloudinaryResponse || cloudinaryResponse.error) {
  //   console.error("Cloudinary error:", cloudinaryResponse?.error);
  //   return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
  // }

  // 6. Database Creation
  try {
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Admin",
      accountVerified: true,
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Database write failed", 500));
  }
});