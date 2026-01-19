import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// @route   GET /api/menu
// @desc    Lấy toàn bộ menu (cho Header)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const [categories] = await pool.query("SELECT * FROM categories");
    const [subcategories] = await pool.query("SELECT * FROM subcategories");

    const menuData = categories.map((category) => ({
      ...category,
      subcategories: subcategories.filter(
        (sub) => sub.category_id === category.id
      ),
    }));

    res.json(menuData);
  } catch (err) {
    console.error(err.message); 
    res.status(500).send("Lỗi Server");
  }
});

export default router;
