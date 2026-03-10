import express from "express";
import { pool } from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import bcrypt from "bcrypt";
import { logActivity } from "../utils/logger.js";

const router = express.Router();
const SALT_ROUNDS = 10;

// GET /api/users – Get all users (Admin only)
router.get("/", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, role FROM users"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// POST /api/users – Create a new user (Admin only)
router.post("/", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone || null, hashedPassword, role]
    );

    const [rows] = await pool.query(
      "SELECT id, name, email, phone, role FROM users WHERE id = ?",
      [result.insertId]
    );

    await logActivity(req.userId, "Created User", `User: ${email} (${role})`);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error while creating user");
  }
});

// PUT /api/users/:id – Update a user (Admin only)
router.put("/:id", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // --- SECURITY CHECK START ---
    // Get current requester's role
    const [requester] = await pool.query("SELECT role FROM users WHERE id = ?", [req.userId]);
    const requesterRole = requester[0].role;

    // Get target user's current role
    const [targetUser] = await pool.query("SELECT role FROM users WHERE id = ?", [id]);
    if (targetUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const targetRole = targetUser[0].role;

    // 1. Prevent Admin from modifying Superadmin
    if (requesterRole !== 'superadmin' && targetRole === 'superadmin') {
      return res.status(403).json({ message: "Access denied. You cannot modify a Super Admin." });
    }

    // 2. Prevent Admin from promoting anyone to Superadmin
    if (requesterRole !== 'superadmin' && role === 'superadmin') {
      return res.status(403).json({ message: "Access denied. You cannot assign the Super Admin role." });
    }
    // --- SECURITY CHECK END ---

    await pool.query(
      "UPDATE users SET name = ?, email = ?, phone = ?, role = ? WHERE id = ?",
      [name, email, phone || null, role, id]
    );

    const [rows] = await pool.query(
      "SELECT id, name, email, phone, role FROM users WHERE id = ?",
      [id]
    );

    await logActivity(req.userId, "Updated User", `User ID: ${id}, Email: ${email}`);

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE /api/users/:id – Delete a user (Admin only)
router.delete("/:id", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const userId = req.params.id;
    // Check role hierarchy
    const [targetUser] = await pool.query("SELECT role FROM users WHERE id = ?", [userId]);

    if (targetUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const targetRole = targetUser[0].role;

    // Get current requester's role
    const [requester] = await pool.query("SELECT role FROM users WHERE id = ?", [req.userId]);
    const requesterRole = requester[0].role;

    // Logic: 
    // - Superadmin can delete anyone.
    // - Admin can delete User.
    // - Admin CANNOT delete Admin or Superadmin.

    if (requesterRole !== 'superadmin' && (targetRole === 'admin' || targetRole === 'superadmin')) {
      return res.status(403).json({ message: "Access denied. You cannot delete this user." });
    }

    const targetEmail = targetUser[0].email; // Assuming email is selected, if not this line will be skipped
    await pool.query("DELETE FROM users WHERE id = ?", [userId]);

    await logActivity(req.userId, "Deleted User", `User ID: ${userId}`);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

export default router;
