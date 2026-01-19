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
      "SELECT id, name, email, phone, password, address, role FROM users WHERE email = ?",
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
      "SELECT id, name, email, phone, address, role FROM users WHERE id = ?",
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
      "SELECT id, name, email, phone, address, role FROM users WHERE id = ?",
      [userId]
    );

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
