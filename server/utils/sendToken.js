export const sendToken = (user, statusCode, message, res) => {
  // 1. Generate the JWT for the user
  const token = user.generateToken();

  // 2. Set cookie options (converting days to milliseconds)
  const options = {
    expires: new Date(
      Date.now() + (process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
    secure:true,
    sameSite:"None" // Prevents client-side scripts from accessing the cookie
  };

  // 3. Send response with status code, cookie, and JSON data
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    user,
    token,
  });
};