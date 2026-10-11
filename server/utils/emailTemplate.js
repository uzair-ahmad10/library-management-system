export const generateVerificationOTPEmailTemplate = (otpCode) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
      <p style="font-size: 16px; color: #555;">Dear User,</p>
      <p style="font-size: 16px; color: #555;">
        To complete your registration or login, please use the following verification code:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 24px; font-weight: bold; background-color: #f4f4f4; padding: 10px 20px; border-radius: 5px; letter-spacing: 2px; color: #333;">
          ${otpCode}
        </span>
      </div>
      <p style="font-size: 14px; color: #555;">
        This code is valid for 15 minutes. Please do not share this code with anyone.
      </p>
      <p style="font-size: 14px; color: #999;">
        If you did not request this email, please ignore it.
      </p>
      <br />
      <p style="font-size: 16px; color: #555; margin-bottom: 0;">Thank you,</p>
      <p style="font-size: 16px; font-weight: bold; color: #333; margin-top: 5px;">BookWorm Team</p>
    </div>
  `;
};

export const generateForgotPasswordEmailTemplate = (resetPasswordURL) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
      <p style="font-size: 16px; color: #555;">Dear User,</p>
      <p style="font-size: 16px; color: #555;">
        We received a request to reset your password. Please click the button below to proceed:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetPasswordURL}" style="background-color: #f5f6f8ff; color: black; padding: 12px 25px; text-decoration: none; font-size: 16px; border-radius: 5px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 14px; color: #555;">
        This link is valid for 15 minutes. 
      </p>
      <p style="font-size: 14px; color: #999;">
        If you did not request this email, please ignore it. Your password will remain safe.
      </p>
      <br />
      <p style="font-size: 16px; color: #555; margin-bottom: 0;">Thank you,</p>
      <p style="font-size: 16px; font-weight: bold; color: #333; margin-top: 5px;">BookWorm Team</p>
    </div>
  `;
};