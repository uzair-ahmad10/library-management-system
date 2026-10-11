import cron from "node-cron";
import { User } from "../models/userModel.js";

export const removeUnverifiedAccounts = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      // Calculate the exact time 30 minutes ago
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      // Delete all users who haven't verified their account and were created more than 30 mins ago
      await User.deleteMany({
        accountVerified: false,
        createdAt: { $lt: thirtyMinutesAgo },
      });
    } catch (error) {
      console.error(
        "Some error occurred while removing unverified accounts",
        error,
      );
    }
  });
};
