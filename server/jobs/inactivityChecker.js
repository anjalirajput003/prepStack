import cron from "node-cron";
import User from "../models/user.model.js";

const startInactivityChecker = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Checking inactive interviewers...");

      const interviewers = await User.find({
        role: "interviewer",
        isBanned: false,
      });

      for (const interviewer of interviewers) {
        const inactiveDays = Math.floor(
          (Date.now() - interviewer.lastActiveAt.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        const expectedWarnings = Math.floor(inactiveDays / 30);

        interviewer.warningCount = Math.min(expectedWarnings, 3);

        if (interviewer.warningCount >= 3) {
          interviewer.isBanned = true;
        }

        await interviewer.save();
      }

      console.log("Inactive interviewer check completed");
    } catch (err) {
      console.log("INACTIVITY CHECK ERROR:", err);
    }
  });
};

export default startInactivityChecker;
