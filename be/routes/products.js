import express from "express";
import { pool } from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { logActivity } from "../utils/logger.js";

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

    await logActivity(req.userId, "Created Product", `Product: ${name} (ID: ${newId})`);

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

    await logActivity(req.userId, "Updated Product", `Product: ${name} (ID: ${id})`);

    res.json(parseProduct(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error while updating product");
  }
});

// Delete product
router.delete("/:id", [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const productId = req.params.id;
    await pool.query("DELETE FROM products WHERE id = ?", [productId]);

    await logActivity(req.userId, "Deleted Product", `Product ID: ${productId}`);

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
    const limit = Number(req.query.limit || 12);
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

    let orderBy = "ORDER BY created_at DESC";
    const sort = req.query.sort;
    if (sort === "hot") {
      orderBy = "ORDER BY (views * 0.3 + sold_count * 0.7) DESC";
    }

    const [rows] = await pool.query(
      `SELECT * FROM products${where} ${orderBy} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      products: rows.map(parseProduct),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error: " + err.message);
  }
});

// Search
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q?.trim().toLowerCase();
    if (!q) return res.json({ products: [], totalPages: 0, currentPage: 1 });

    // Log search keyword
    const userId = req.user?.id || null; // Might be undefined if public route, verify authMiddleware usage or handle gracefully
    // Since this public route might not use authMiddleware, req.user might be missing. 
    // We'll leave user_id null for now or check if we want to parse token optionally.
    // For simplicity, just log keyword.

    // Log search keyword (Debounced: 5s) - ATOMIC QUERY to prevent race conditions
    try {
      await pool.query(`
        INSERT INTO search_logs (keyword, created_at)
        SELECT ?, NOW()
        FROM DUAL
        WHERE NOT EXISTS (
          SELECT 1 FROM search_logs 
          WHERE keyword = ? 
          AND created_at >= DATE_SUB(NOW(), INTERVAL 5 SECOND)
        )
      `, [q, q]);
    } catch (logErr) {
      console.error("Logging search failed:", logErr);
    }

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

    // Increment views (Total)
    await pool.query("UPDATE products SET views = views + 1 WHERE id = ?", [req.params.id]).catch(console.error);

    // Record detailed view event for Trending Algorithm
    // user_id is null for anonymous users since this is a public route
    await pool.query(
      "INSERT INTO product_views (product_id, user_id, created_at) VALUES (?, NULL, NOW())",
      [req.params.id]
    ).catch(console.error);

    res.json(parseProduct(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
