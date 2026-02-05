import bcrypt from "bcrypt";
import User from "../models/User.model.js";

export const createAdminIfNotExists = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("❌ Admin env variables missing");
    return;
  }

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log("✅ Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await User.create({
    fullName: "Super Admin",
    email: adminEmail,
    passwordHash: hashedPassword,
    role: "admin",
    isActive: true,
  });

  console.log("🔥 Admin user created successfully");
};
