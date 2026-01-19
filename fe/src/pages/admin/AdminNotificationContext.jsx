import { createContext, useContext, useEffect, useState } from "react";
import api from "../../utils/api";

const AdminNotificationContext = createContext(null);

export const AdminNotificationProvider = ({ children }) => {
    const [pendingOrders, setPendingOrders] = useState(0);

    // notification state
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    /* ================= FETCH PENDING ORDERS ================= */
    const fetchPendingOrders = async () => {
        try {
            const res = await api.get("/admin/orders/pending/count");
            setPendingOrders(res.data.total || 0);
        } catch (err) {
            console.error("Fetch pending orders failed", err);
        }
    };

    /* ================= FETCH NOTIFICATIONS ================= */
    const fetchNotifications = async () => {
        try {
            const res = await api.get("/admin/notifications");
            setNotifications(res.data || []);
        } catch (err) {
            console.error("Fetch notifications failed", err);
        }
    };

    /* ================= FETCH UNREAD COUNT ================= */
    const fetchUnreadCount = async () => {
        try {
            const res = await api.get("/admin/notifications/unread/count");
            setUnreadCount(res.data.total || 0);
        } catch (err) {
            console.error("Fetch unread count failed", err);
        }
    };

    /* ================= MARK AS READ ================= */
    const markAsRead = async (id) => {
        try {
            await api.put(`/admin/notifications/${id}/read`);

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === id ? { ...n, is_read: true } : n
                )
            );

            setUnreadCount((c) => Math.max(0, c - 1));
        } catch (err) {
            console.error("Mark notification as read failed", err);
        }
    };

    /* ================= INIT ================= */
    useEffect(() => {
        fetchPendingOrders();
        fetchNotifications();
        fetchUnreadCount();

        const interval = setInterval(() => {
            fetchPendingOrders();
            fetchNotifications();
            fetchUnreadCount();
        }, 15000); // 15s poll

        return () => clearInterval(interval);
    }, []);

    return (
        <AdminNotificationContext.Provider
            value={{
                pendingOrders,
                setPendingOrders,
                notifications,
                unreadCount,
                markAsRead,
            }}
        >
            {children}
        </AdminNotificationContext.Provider>
    );
};

export const useAdminNotification = () => {
    const ctx = useContext(AdminNotificationContext);
    if (!ctx) {
        throw new Error(
            "useAdminNotification must be used within AdminNotificationProvider"
        );
    }
    return ctx;
};
