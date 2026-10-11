import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    
    password: {
      type: String,
      required: true,
      select: false, // Prevents the password from being returned in standard queries
    },
    
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    
    accountVerified: {
      type: Boolean,
      default: false,
    },

    borrowedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Borrow",
        },
        returned: {
          type: Boolean,
          default: false,
        },
        title: {
          type: String,
        },
        borrowedDate: {
          type: Date,
        },
        dueDate: {
          type: Date,
        },
      },
    ],

    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },

    verificationCode: {
      type: Number,
    },

    verificationCodeExpire: {
      type: Date,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },

  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  },
);

userSchema.methods.generateVerificationCode = function () {
  // Helper function to generate a 5-digit number without a leading zero
  function generateRandomFiveDigitNumber() {
    const firstDigit = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const remainingDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0"); // Pad with 0s if less than 4 digits

    // Concatenate as strings, then parse back to an integer
    return parseInt(firstDigit + remainingDigits);
  }

  const verificationCode = generateRandomFiveDigitNumber();

  this.verificationCode = verificationCode;
  
  // Set expiration time to 15 minutes from now
  this.verificationCodeExpire = Date.now() + 15 * 60 * 1000; 

  return verificationCode;
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id }, // Payload: storing the user's ID inside the token
    process.env.JWT_SECRET_KEY, // Secret key used to sign the token
    {
      expiresIn: process.env.JWT_EXPIRE, // Expiration time (e.g., "7d")
    }
  );
};

userSchema.methods.getResetPasswordToken = function () {
  // 1. Generate a secure random token (20 bytes) and convert it to a hex string
  const resetToken = crypto.randomBytes(20).toString("hex");

  // 2. Hash the generated token using the SHA-256 algorithm
  // We save the HASHED version in the database for security purposes
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 3. Set the expiration time to 15 minutes from now
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  // 4. Return the UNHASHED token so it can be emailed to the user
  return resetToken;
};

export const User = mongoose.model("User", userSchema);
