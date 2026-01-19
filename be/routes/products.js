import express from "express";
import { pool } from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/* =======================
   Utility helpers
======================= */

const safeStringifyArray = (val) => {
  if (Array.isArray(val)) return JSON.stringify(val);
  if (val == null) return JSON.stringify([]);

  if (typeof val === "string") {
    const s = val.trim();
    try {
      const parsed = JSON.parse(s);
      return JSON.stringify(Array.isArray(parsed) ? parsed : [parsed]);
    } catch {
      return JSON.stringify(
        s.split(",").map((p) => p.trim()).filter(Boolean)
      );
    }
  }

  try {
    return JSON.stringify(val);
  } catch {
    return JSON.stringify([]);
  }
};

const safeParseArray = (val) => {
  if (Array.isArray(val)) return val;
  if (val == null) return [];

  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return val.split(",").map((p) => p.trim()).filter(Boolean);
    }
  }

  return [val];
};

/* =======================
   Prepare & Parse product
======================= */

const prepareProductData = (data) => {
  const product = { ...data };

  const quantity = Number(product.quantity ?? 0);

  product.quantity = quantity;
  product.status = quantity > 0 ? "In stock" : "Out of stock";
  product.originalPrice =
    product.originalPrice === "" ? null : product.originalPrice ?? null;

  product.imageUrl = product.imageUrl ?? null;
  product.images = safeStringifyArray(product.images);
  product.sizes = safeStringifyArray(product.sizes);
  product.colors = safeStringifyArray(product.colors);

  return product;
};

const parseProduct = (product) => ({
  ...product,
  images: safeParseArray(product.images || "[]"),
  sizes: safeParseArray(product.sizes || "[]"),
  colors: safeParseArray(product.colors || "[]"),
});

/* =======================
   ADMIN ROUTES
======================= */

// Get all products
router.get("/", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM products ORDER BY category, name"
    );
    res.json(rows.map(parseProduct));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Add product
router.post("/", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const data = prepareProductData(req.body);
    const newId = `p${Date.now()}`;

    const {
      name,
      category,
      brand,
      price,
      originalPrice,
      quantity,
      status,
      imageUrl,
      images,
      sizes,
      colors,
    } = data;

    await pool.query(
      `INSERT INTO products 
       (id, name, category, brand, price, originalPrice, quantity, status, imageUrl, images, sizes, colors, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        newId,
        name,
        category,
        brand,
        price,
        originalPrice,
        quantity,
        status,
        imageUrl,
        images,
        sizes,
        colors,
      ]
    );

    const [rows] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [newId]
    );

    res.status(201).json(parseProduct(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error while adding product");
  }
});

// Update product
router.put("/:id", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { id } = req.params;
    const data = prepareProductData(req.body);

    const {
      name,
      category,
      brand,
      price,
      originalPrice,
      quantity,
      status,
      imageUrl,
      images,
      sizes,
      colors,
    } = data;

    await pool.query(
      `UPDATE products SET
        name = ?, category = ?, brand = ?, price = ?, originalPrice = ?,
        quantity = ?, status = ?, imageUrl = ?, images = ?, sizes = ?, colors = ?,
        updated_at = NOW()
       WHERE id = ?`,
      [
        name,
        category,
        brand,
        price,
        originalPrice,
        quantity,
        status,
        imageUrl,
        images,
        sizes,
        colors,
        id,
      ]
    );

    const [rows] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    res.json(parseProduct(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error while updating product");
  }
});

// Delete product
router.delete("/:id", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/* =======================
   PUBLIC ROUTES
======================= */

// Get products (pagination + filter)
router.get("/public", async (req, res) => {
  try {
    const { category, brand } = req.query;
    const page = Number(req.query.page || 1);
    const limit = 12;
    const offset = (page - 1) * limit;

    let where = " WHERE quantity > 0 ";
    const params = [];

    if (category) {
      where += "AND category = ? ";
      params.push(category);
    }
    if (brand) {
      where += "AND brand = ? ";
      params.push(brand);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM products${where}`,
      params
    );

    const [rows] = await pool.query(
      `SELECT * FROM products${where} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      products: rows.map(parseProduct),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Search
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q?.trim().toLowerCase();
    if (!q) return res.json({ products: [], totalPages: 0, currentPage: 1 });

    const page = Number(req.query.page || 1);
    const limit = 12;
    const offset = (page - 1) * limit;
    const keyword = `%${q}%`;

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM products
       WHERE quantity > 0 AND
       (LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(category) LIKE ?)`,
      [keyword, keyword, keyword]
    );

    const [rows] = await pool.query(
      `SELECT * FROM products
       WHERE quantity > 0 AND
       (LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(category) LIKE ?)
       LIMIT ? OFFSET ?`,
      [keyword, keyword, keyword, limit, offset]
    );

    res.json({
      products: rows.map(parseProduct),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Product detail
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(parseProduct(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
