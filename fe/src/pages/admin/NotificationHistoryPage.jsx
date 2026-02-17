import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  Check,
  Trash2,
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import "./TailAdmin.css";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const NotificationHistoryPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/notifications");
      // Assuming existing API returns limit 20, might need new endpoint for full history
      // modifying to use existing for now, backend changes might be needed for pagination
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/admin/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (id) => {
    setNotificationToDelete(id);
    setDeleteModalOpen(true);
  };

  const verifyDelete = async () => {
    if (!notificationToDelete) return;

    try {
      // Mock delete or implement if backend supports
      // await api.delete(`/admin/notifications/${notificationToDelete}`);
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationToDelete),
      );
      // Determine if we need to call API - the user prompt implied just UI improvement but assuming functionality exists or is mocked as per original code
      // Original code: // Mock delete or implement if backend supports
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setDeleteModalOpen(false);
      setNotificationToDelete(null);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    return true;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-green-500" />;
      case "alert":
        return <AlertTriangle size={20} className="text-red-500" />;
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 2xl:p-10 font-sans text-slate-900">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Manage and view all system alerts.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === "all" ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-100"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === "unread" ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-100"}`}
          >
            Unread
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading notifications...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
              <Bell size={32} />
            </div>
            <p className="text-slate-500 font-medium">
              No notifications found.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {filteredNotifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-6 hover:bg-slate-50 transition-colors flex gap-4 ${!notification.is_read ? "bg-indigo-50/20" : ""}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4
                      className={`text-base ${!notification.is_read ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}
                    >
                      {notification.message}
                    </h4>
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                      {new Date(notification.created_at).toLocaleString(
                        "vi-VN",
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-3">
                    {notification.type === "alert"
                      ? "High priority system alert."
                      : "General system notification."}
                  </p>

                  <div className="flex gap-3">
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <Check size={14} /> Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(notification.id)}
                      className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={verifyDelete}
        title="Delete Notification"
        message="Are you sure you want to delete this notification? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default NotificationHistoryPage;
