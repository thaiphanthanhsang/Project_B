import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle, AlertTriangle, Info, X, Check } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";
import "./NotificationDropdown.css";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        api.get("/admin/notifications"),
        api.get("/admin/notifications/unread/count"),
      ]);
      setNotifications(listRes.data);
      setUnreadCount(countRes.data.total);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    if (!id) return; // Prevent clicking on empty
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await api.put(`/admin/notifications/${id}/read`);
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllRead = async () => {
    // Optimistic
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      await Promise.all(
        unreadIds.map((id) => api.put(`/admin/notifications/${id}/read`)),
      );
    } catch (error) {
      console.error("Failed to mark all read", error);
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Styles Helper
  const getTypeStyles = (type) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-50",
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
          icon: <CheckCircle size={18} />,
        };
      case "alert":
        return {
          bg: "bg-rose-50",
          iconBg: "bg-rose-100",
          iconColor: "text-rose-600",
          icon: <AlertTriangle size={18} />,
        };
      default:
        return {
          bg: "bg-indigo-50",
          iconBg: "bg-indigo-100",
          iconColor: "text-indigo-600",
          icon: <Info size={18} />,
        };
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`relative p-2.5 rounded-full transition-all duration-300 ${isOpen ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"}`}
      >
        <Bell size={22} strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-white"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-[400px] rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden z-[9999] origin-top-right"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-50 bg-white/50 backdrop-blur-sm flex justify-between items-center sticky top-0 z-10">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  Notifications
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {unreadCount} unread messages
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                >
                  <Check size={14} /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[450px] overflow-y-auto scroll-smooth custom-scrollbar bg-slate-50/50">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <Bell size={32} />
                  </div>
                  <h4 className="text-slate-800 font-semibold mb-1">
                    No notifications
                  </h4>
                  <p className="text-slate-500 text-sm">
                    You're all caught up! Check back later.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {notifications.map((notification) => {
                    const styles = getTypeStyles(notification.type);
                    return (
                      <li
                        key={notification.id}
                        className={`relative px-5 py-4 transition-all duration-200 cursor-pointer hover:bg-slate-50 ${!notification.is_read ? "bg-white" : "bg-slate-50/50 opacity-75 grayscale-[0.3]"}`}
                        onClick={() =>
                          !notification.is_read && markAsRead(notification.id)
                        }
                      >
                        {!notification.is_read && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-indigo-500"></div>
                        )}

                        <div className="flex gap-4">
                          {/* Icon Box */}
                          <div
                            className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 ${styles.iconColor}`}
                          >
                            {styles.icon}
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                              <p
                                className={`text-sm ${!notification.is_read ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}
                              >
                                {notification.message}
                              </p>
                              <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap ml-2">
                                {getTimeAgo(notification.created_at)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {notification.type === "alert"
                                ? "High priority alert needs attention."
                                : "System notification update."}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 bg-white text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/admin/notifications");
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 py-2 w-full rounded-lg hover:bg-slate-50 transition-colors"
              >
                View All Activity
              </button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
