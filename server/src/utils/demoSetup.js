import { Users } from "../models/user.model.js";
import { Wishlists } from "../models/wishlist.model.js";
import { Components } from "../models/component.model.js";
import { Requests } from "../models/request.model.js";
import { Logs } from "../models/log.model.js";

export const initializeDemoAccounts = async () => {
  try {
    const demoAccounts = [
      {
        name: "Demo Manager",
        email: "demo-manager@example.com",
        password: "password",
        role: "manager",
        isDemo: true,
      },
      {
        name: "Demo User",
        email: "demo-user@example.com",
        password: "password",
        role: "user",
        isDemo: true,
      },
    ];

    for (const account of demoAccounts) {
      // 1. Ensure the email is whitelisted in Wishlists (required to allow authentication/registration flows)
      const whitelistExists = await Wishlists.findOne({ email: account.email });
      if (!whitelistExists) {
        await Wishlists.create({
          username: account.name,
          email: account.email,
        });
        console.log(` Whitelisted demo email: ${account.email}`);
      }

      // 2. Ensure the demo user exists in Users
      const userExists = await Users.findOne({ email: account.email });
      if (!userExists) {
        await Users.create(account);
        console.log(` Created demo user: ${account.name} (${account.email})`);
      } else {
        // Ensure the isDemo flag is set to true
        if (!userExists.isDemo) {
          userExists.isDemo = true;
          await userExists.save();
          console.log(` Updated existing user ${account.email} to be a demo account`);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error initializing demo accounts:", error);
  }
};

export const startDemoCleanupJob = () => {
  // Run immediately on boot, then every hour
  const runCleanup = async () => {
    try {
      console.log("🧹 Running scheduled demo data cleanup...");
      const resultComp = await Components.deleteMany({ isDemo: true });
      const resultReq = await Requests.deleteMany({ isDemo: true });
      const resultLogs = await Logs.deleteMany({ isDemo: true });
      console.log(
        ` Demo cleanup successful: deleted ${resultComp.deletedCount} components, ${resultReq.deletedCount} requests, ${resultLogs.deletedCount} logs.`
      );
    } catch (err) {
      console.error("❌ Failed to run demo cleanup:", err);
    }
  };

  runCleanup();
  setInterval(runCleanup, 1000 * 60 * 60); // every 1 hour
};
