// controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// Helper: create short-lived access token
const signAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      // clinicId: user.role === "doctor" ? something : null, // add later if needed
    },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }   // ← shorter is safer (we'll add refresh later)
  );
};

// POST /api/auth/register
// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword, role } = req.body;

    // 1. Basic validation
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, password and role are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // 2. Only allow parent & doctor from public signup
    const allowedRoles = ["parent", "doctor"];
    const normalizedRole = role.toLowerCase().trim();
    if (!allowedRoles.includes(normalizedRole)) {
      return res.status(403).json({
        success: false,
        message: "Invalid role. Only 'parent' or 'doctor' allowed for registration",
      });
    }

    // 3. Check existing user
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    // 4. Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // 5. Create user — FIXED phone handling
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone && typeof phone === 'string' ? phone.trim() : undefined,   // ← safe now
      passwordHash,
      role: normalizedRole,
    });

    // 6. Generate token
    const accessToken = signAccessToken(user);

    // Return safe user data + token
    res.status(201).json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Optional: role check on login (helps if frontend sends it)
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // If frontend sends role → extra check (makes it harder for guessing)
    if (role && user.role !== role.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: "This account does not have the selected role",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const accessToken = signAccessToken(user);

    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
