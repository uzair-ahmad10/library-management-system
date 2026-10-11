import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  // 1. Create the transporter using your SMTP credentials
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: subject,
    html: message, // Uses 'html' here because the template we are passing contains HTML tags
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};