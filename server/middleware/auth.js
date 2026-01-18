import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth?.() || {};
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(userId);

    const role = user?.privateMetadata?.role || user?.publicMetadata?.role;

    if (role !== "admin") {
      console.log("Unauthorized access attempt. Role detected:", role);
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
