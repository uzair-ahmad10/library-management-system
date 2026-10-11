import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { sendEmail } from "../utils/sendEmail.js";


export const notifyUsers = () => {
  cron.schedule("* * * * *", async () => {
    try {
      // Calculate the time for 24 hours ago
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Find all borrowed books matching the criteria
      const borrows = await Borrow.find({
        dueDate: { $lte: oneDayAgo },
        returnDate: null,
        notified: false,
      });

      // Loop through all the fetched borrows
      for (const element of borrows) {
        if (element.user && element.user.email) {
          const message = `Hello ${element.user.name},\n\nThis is a reminder that the book you borrowed is due for return today. Please return the book to the library as soon as possible.\n\nThank you`;

          // Send the reminder email
          await sendEmail({
            email: element.user.email,
            subject: "Book Return Reminder",
            message: message,
          });

          // Set the notified flag to true and save so the email isn't sent again
          element.notified = true;
          await element.save();
        }
      }
    } catch (error) {
      console.error("Some error occurred while notifying users", error);
    }
  });
};
