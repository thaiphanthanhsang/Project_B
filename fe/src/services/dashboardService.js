import api from "../utils/api";

/**
 * Standardized API Response Handler
 * Extracts data from { success: true, data: ... } format
 */
const handleResponse = (response) => {
    if (response.data && response.data.success) {
        return response.data.data;
    }
    // Fallback for legacy endpoints or direct data returns
    return response.data;
};

export const dashboardService = {
    getStats: async (params) => {
        const response = await api.get("/dashboard/stats", { params });
        return handleResponse(response);
    },

    getSalesChart: async (params) => {
        const response = await api.get("/dashboard/sales-chart", { params });
        return handleResponse(response);
    },

    getTopProducts: async (type = "purchased") => {
        const response = await api.get(`/dashboard/top-products?type=${type}`);
        return handleResponse(response);
    },

    getTrendingProducts: async () => {
        const response = await api.get("/dashboard/trending-products");
        return handleResponse(response);
    },

    getInventoryHealth: async () => {
        const response = await api.get("/dashboard/inventory-health");
        return handleResponse(response);
    },

    getOrderStatus: async (params) => {
        const response = await api.get("/dashboard/order-status", { params });
        return handleResponse(response);
    },

    getSearchAnalytics: async () => {
        const response = await api.get("/dashboard/search-analytics");
        return handleResponse(response);
    },

    getFulfillmentPriority: async () => {
        const response = await api.get("/dashboard/fulfillment-priority");
        return handleResponse(response);
    },

    applyDiscount: async (productId, discountPercent) => {
        const response = await api.post("/dashboard/apply-discount", { productId, discountPercent });
        return handleResponse(response);
    },

    getLowStockList: async () => {
        const response = await api.get("/dashboard/low-stock");
        return handleResponse(response);
    }
};
