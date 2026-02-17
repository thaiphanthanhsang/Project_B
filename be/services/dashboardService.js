import { pool } from "../db.js";

// Service Layer: Handles business logic and complex database queries
export const dashboardService = {
  // 1. Get KPI Stats with Filters
  getStats: async ({ startDate, endDate }) => {
    // Determine date filter clause
    let dateFilter = "";
    const params = [];
    if (startDate && endDate) {
      dateFilter = "WHERE created_at BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    // Revenue
    const revenueQuery = `SELECT IFNULL(SUM(total_price), 0) as revenue FROM orders ${dateFilter}`;
    const [[{ revenue }]] = await pool.query(revenueQuery, params);

    // Total Orders
    const ordersQuery = `SELECT COUNT(*) as totalOrders FROM orders ${dateFilter}`;
    const [[{ totalOrders }]] = await pool.query(ordersQuery, params);

    // Completed Orders count for Rate
    const completedQuery = `SELECT COUNT(*) as completed FROM orders ${dateFilter ? dateFilter + " AND" : "WHERE"} status = 'completed'`;
    const [[{ completed }]] = await pool.query(completedQuery, params);

    // Total Users (usually not filtered by date unless "New Users")
    const [[{ totalUsers }]] = await pool.query("SELECT COUNT(*) as totalUsers FROM users");

    // Low Stock
    const [[{ lowStock }]] = await pool.query("SELECT COUNT(*) as lowStock FROM products WHERE quantity < 5");

    return {
      revenue,
      totalOrders,
      completionRate: totalOrders > 0 ? ((completed / totalOrders) * 100).toFixed(1) : 0,
      totalUsers,
      lowStock,
    };
  },

  // 2. Sales Chart (Area/Line) - Group by Date
  getSalesChart: async ({ startDate, endDate }) => {
    let dateFilter = "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    const params = [];

    if (startDate && endDate) {
      dateFilter = "WHERE created_at BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    const query = `
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m-%d') as date,
        SUM(total_price) as revenue,
        COUNT(*) as orders
      FROM orders
      ${dateFilter}
      GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
      ORDER BY date ASC
    `;
    const [rows] = await pool.query(query, params);
    return rows;
  },

  // 3. Top Products (Viewed or Purchased)
  getTopProducts: async (type = 'purchased', limit = 10) => {
    if (type === 'viewed') {
      // Use product_views table for granular data or products.views column as fallback
      // For now, let's use the aggregated `views` column in products
      // OR better: join with product_views count if we want strictly recent
      // Let's keep it simple: use products table columns
      const query = `
        SELECT id, name, views, sold_count
        FROM products
        ORDER BY views DESC
        LIMIT ?
      `;
      const [rows] = await pool.query(query, [limit]);
      return rows;
    } else {
      // Purchased
      const query = `
        SELECT id, name, views, sold_count, price
        FROM products
        ORDER BY sold_count DESC
        LIMIT ?
      `;
      const [rows] = await pool.query(query, [limit]);
      return rows;
    }
  },

  // 4. Inventory Health (Aging)
  getInventoryHealth: async () => {
    // Logic: Find items created > 30 days ago with stock > 0 and low sales
    // Logic: Find items with Stock > 20 AND No sales in last 30 days
    const query = `
      SELECT 
        p.id, p.name, p.quantity, p.views, p.sold_count, p.imageUrl,
        DATEDIFF(NOW(), p.created_at) as days_since_created,
        DATEDIFF(NOW(), p.created_at) as days_since_created,
        MAX(o.created_at) as last_sold_at,
        DATEDIFF(NOW(), MAX(o.created_at)) as days_since_last_sale
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id
      WHERE p.quantity > 20
      GROUP BY p.id
      HAVING 
        (last_sold_at IS NULL AND days_since_created > 60) 
        OR 
        (last_sold_at IS NOT NULL AND days_since_last_sale > 30)
      ORDER BY p.quantity DESC
      LIMIT 20
    `;
    const [rows] = await pool.query(query);
    // Process into distribution for charts if needed, or return list
    // Let's return list, frontend can aggregate for pie chart
    return rows;
  },

  // 5. Trending Products (Algorithm: Score = Views*0.3 + Sold*0.7)
  getTrendingProducts: async () => {
    const query = `
            SELECT 
                id, name, price, views, sold_count, quantity, imageUrl,
                ((views * 0.3) + (sold_count * 0.7)) as priorityScore
            FROM products
            WHERE quantity > 0
            ORDER BY priorityScore DESC
            LIMIT 10
        `;
    const [rows] = await pool.query(query);
    return rows;
  },

  // 6. Search Analytics
  getSearchAnalytics: async () => {
    const [rows] = await pool.query(`
            SELECT keyword, COUNT(*) as count 
            FROM search_logs 
            GROUP BY keyword 
            ORDER BY count DESC 
            LIMIT 10
        `);
    return rows;
  },

  // 7. Fulfillment Priority
  getFulfillmentPriority: async () => {
    const [rows] = await pool.query(`
            SELECT id, full_name, total_price, created_at, status
            FROM orders
            WHERE status IN ('pending', 'confirmed')
            ORDER BY created_at ASC
            LIMIT 10
        `);
    return rows;
  },

  // 8. Apply Discount (Action)
  applyDiscount: async (productId, discountPercent) => {
    await pool.query(`
            UPDATE products 
            SET price = price * (1 - ? / 100)
            WHERE id = ?
        `, [discountPercent, productId]);
    return { success: true };
  },

  // 9. Order Status Distribution
  getOrderStatus: async ({ startDate, endDate }) => {
    let dateFilter = "";
    const params = [];
    if (startDate && endDate) {
      dateFilter = "WHERE created_at BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    const query = `
      SELECT status, COUNT(*) as count
      FROM orders
      ${dateFilter}
      GROUP BY status
    `;
    const [rows] = await pool.query(query, params);
    return rows;
  },

  // 6. Pending vs Completed (Simple ratio)
  getPendingVsCompleted: async () => {
    const query = `
      SELECT 
        SUM(CASE WHEN status IN ('pending', 'confirmed') THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM orders
    `;
    const [[result]] = await pool.query(query);
    return result;
  },

  // 10. Get Low Stock List (Detailed)
  getLowStockList: async () => {
    const query = `
      SELECT id, name, quantity, imageUrl, price, status
      FROM products
      WHERE quantity < 5
      ORDER BY quantity ASC
      LIMIT 20
    `;
    const [rows] = await pool.query(query);
    return rows;
  }
};
