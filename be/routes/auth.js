import express from "express";
import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const SALT_ROUNDS = 10;

// 🟢 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required information" });
    }

    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone || null, hashedPassword]
    );

    res.status(200).json({ message: "Registration successful!" });
  } catch (err) {
    console.error("MySQL Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// 🟡 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email or password missing" });
    }

    const [rows] = await pool.query(
      "SELECT id, name, email, phone, password, address, role, avatar FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const userToReturn = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      avatar: user.avatar,
    };

    res.status(200).json({
      message: "Login successful!",
      token: token,
      user: userToReturn,
    });
  } catch (err) {
    console.error("MySQL Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// 🔵 GET USER PROFILE
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, address, role, avatar FROM users WHERE id = ?",
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// 🟣 UPDATE USER PROFILE
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    await pool.query(
      "UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?",
      [name, phone || null, address || null, userId]
    );

    const [rows] = await pool.query(
      "SELECT id, name, email, phone, address, role, avatar FROM users WHERE id = ?",
      [userId]
    );

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

import nodemailer from "nodemailer";

// Configure Nodemailer (Use Ethereal for dev if credentials missing, but here assuming user will add env vars)
// If process.env.EMAIL_USER is not set, this might fail or we should use a fallback.
// For this task, I will use a simple transporter.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-app-password",
  },
});

// 🟠 1. REQUEST PIN
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      // Security: Don't reveal if user exists, but for now return 404 for easier dev
      return res.status(404).json({ message: "User with this email does not exist" });
    }

    // Generate 6-digit PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await pool.query("UPDATE users SET reset_pin = ?, reset_pin_expiry = ? WHERE email = ?", [
      pin,
      expiry,
      email,
    ]);

    // Send Email
    const mailOptions = {
      from: process.env.EMAIL_USER || "no-reply@shopsqb.com",
      to: email,
      subject: "Your Password Reset PIN - ShopSQB",
      text: `Your password reset PIN is: ${pin}. It expires in 15 minutes.`,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #2563eb;">Password Reset Request</h2>
                <p>Use the following 6-digit PIN to reset your password:</p>
                <div style="background: #f3f4f6; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    ${pin}
                </div>
                <p>This PIN expires in 15 minutes.</p>
                <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
             </div>`,
    };

    // Attempt to send email, log if fails (so dev can at least see PIN in console)
    try {
      if (process.env.EMAIL_USER) {
        await transporter.sendMail(mailOptions);
      } else {
        console.log("⚠️ EMAIL_USER not set. Printing PIN to console only.");
      }
      console.log(`[DEV] Reset PIN for ${email}: ${pin}`);
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      console.log(`[DEV] Fallback PIN for ${email}: ${pin}`);
      // Consider whether to fail the request or just let dev know.
      // For now, return success so flow continues (dev can see PIN in console)
    }

    res.status(200).json({ message: "PIN sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Failed to process request" });
  }
});

// 🟠 2. VERIFY PIN
router.post("/verify-pin", async (req, res) => {
  try {
    const { email, pin } = req.body;
    if (!email || !pin) return res.status(400).json({ message: "Email and PIN required" });

    const [rows] = await pool.query(
      "SELECT id, reset_pin, reset_pin_expiry FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) return res.status(400).json({ message: "Invalid request" });

    const user = rows[0];

    // Check PIN match
    if (user.reset_pin !== pin) {
      return res.status(400).json({ message: "Invalid PIN" });
    }

    // Check Expiry
    if (new Date() > new Date(user.reset_pin_expiry)) {
      return res.status(400).json({ message: "PIN has expired" });
    }

    // Valid! Return a temporary "grant" token? 
    // Or just let the client proceed to step 3? 
    // Ideally, we issue a temporary JWT "reset-token" valid for 5 mins to use in step 3.
    const resetToken = jwt.sign({ userId: user.id, scope: 'reset' }, process.env.JWT_SECRET, { expiresIn: '5m' });

    res.status(200).json({ message: "PIN Verified", resetToken });

  } catch (err) {
    console.error("Verify PIN Error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
});

// 🟠 3. RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) return res.status(400).json({ message: "Missing required fields" });

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
      if (decoded.scope !== 'reset') throw new Error("Invalid token scope");
    } catch (e) {
      return res.status(401).json({ message: "Invalid or expired session. Please start over." });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update DB and clear PIN
    await pool.query(
      "UPDATE users SET password = ?, reset_pin = NULL, reset_pin_expiry = NULL WHERE id = ?",
      [hashedPassword, decoded.userId]
    );

    res.status(200).json({ message: "Password reset successful! You can now login." });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Reset failed" });
  }
});

import multer from "multer";
import path from "path";
import fs from "fs";

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed"));
  },
});

// 🟠 UPLOAD AVATAR
router.post("/upload-avatar", authMiddleware, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.userId;
    // Construct public URL (assuming server runs on process.env.PORT or 5000)
    // NOTE: In production, you might want to store full URL or just path
    const avatarUrl = `/uploads/${req.file.filename}`;

    await pool.query("UPDATE users SET avatar = ? WHERE id = ?", [avatarUrl, userId]);

    // Return updated user info or just the avatar
    res.status(200).json({
      message: "Avatar updated",
      avatar: avatarUrl
    });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Upload failed: " + err.message });
  }
});

export default router;
