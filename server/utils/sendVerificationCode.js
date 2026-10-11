import { generateVerificationOTPEmailTemplate } from "./emailTemplate.js";
import { sendEmail } from "./sendEmail.js";

export const sendVerificationCode = async (verificationCode, email, res) => {
  try {
    // Generate the HTML template for the email
    const message = generateVerificationOTPEmailTemplate(verificationCode);

    // Send the email
    await sendEmail({
      email: email,
      subject: "Verification Code - BookWorm Library Management System",
      message: message,
    });

    // Send the success response to the client
    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Verification code failed to send",
    });
  }
};