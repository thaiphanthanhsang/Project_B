import { dashboardService } from "../services/dashboardService.js";

const successResponse = (res, data, message = "Success") => {
    return res.status(200).json({
        success: true,
        code: 200,
        message,
        data
    });
};

const errorResponse = (res, error, message = "Server Error") => {
    console.error(error);
    return res.status(500).json({
        success: false,
        code: 500,
        message,
        data: null
    });
};

export const dashboardController = {
    getStats: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const stats = await dashboardService.getStats({ startDate, endDate });
            successResponse(res, stats, "Stats fetched successfully");
        } catch (err) {
            errorResponse(res, err, "Error fetching stats");
        }
    },

    getSalesChart: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const data = await dashboardService.getSalesChart({ startDate, endDate });
            successResponse(res, data, "Sales chart fetched successfully");
        } catch (err) {
            errorResponse(res, err, "Error fetching sales chart");
        }
    },

    getTopProducts: async (req, res) => {
        try {
            const { type } = req.query;
            const data = await dashboardService.getTopProducts(type);
            successResponse(res, data, "Top products fetched successfully");
        } catch (err) {
            errorResponse(res, err, "Error fetching top products");
        }
    },

    getInventoryHealth: async (req, res) => {
        try {
            const data = await dashboardService.getInventoryHealth();
            successResponse(res, data, "Inventory health fetched successfully");
        } catch (err) {
            errorResponse(res, err, "Error fetching inventory health");
        }
    },

    getTrendingProducts: async (req, res) => {
        try {
            const data = await dashboardService.getTrendingProducts();
            successResponse(res, data, "Trending products fetched successfully");
        } catch (err) {
            errorResponse(res, err, "Error fetching trending products");
        }
    },

    getOrderStatus: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const data = await dashboardService.getOrderStatus({ startDate, endDate });
            successResponse(res, data, "Order status fetched successfully");
        } catch (err) {
            errorResponse(res, err, "Error fetching order status");
        }
    },

    getPendingVsCompleted: async (req, res) => {
        try {
            const data = await dashboardService.getPendingVsCompleted();
            successResponse(res, data, "Pending vs completed fetched successfully");
        } catch (err) {
            errorResponse(res, err, "Error fetching pending vs completed");
        }
    },

    getSearchAnalytics: async (req, res) => {
        try {
            const data = await dashboardService.getSearchAnalytics();
            successResponse(res, data, "Search analytics fetched successfully");
        } catch (err) {
            errorResponse(res, err, "Error fetching search analytics");
        }
    },

    getFulfillmentPriority: async (req, res) => {
        try {
            const data = await dashboardService.getFulfillmentPriority();
            successResponse(res, data, "Fulfillment priority fetched successfully");
        } catch (err) {
            errorResponse(res, err, "Error fetching fulfillment priority");
        }
    },

    applyDiscount: async (req, res) => {
        try {
            const { productId, discountPercent } = req.body;
            await dashboardService.applyDiscount(productId, discountPercent);
            successResponse(res, null, "Discount applied successfully");
        } catch (err) {
            errorResponse(res, err, "Error applying discount");
        }
    },

    getLowStockList: async (req, res) => {
        try {
            const data = await dashboardService.getLowStockList();
            successResponse(res, data, "Low stock list fetched successfully");
        } catch (err) {
            errorResponse(res, err, "Error fetching low stock list");
        }
    }
};
