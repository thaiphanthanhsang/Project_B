import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import api from "../../../utils/api";
import { useAdminNotification } from "../AdminNotificationContext";
import "./style.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // thêm state UI (KHÔNG ẢNH HƯỞNG CODE CŨ)
  const [showNoti, setShowNoti] = useState(false);

  // GIỮ NGUYÊN pendingOrders + BỔ SUNG notification
  const {
    pendingOrders,
    setPendingOrders,
    notifications,
    unreadCount,
    markAsRead
  } = useAdminNotification();

  /* ================= AUTH ================= */
  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (!saved) {
      navigate(`/${ROUTERS.USER.LOGIN}`);
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      if (parsed.role !== "admin") {
        navigate(`/${ROUTERS.USER.HOME}`);
        return;
      }
      setUser(parsed);
    } catch {
      localStorage.clear();
      navigate(`/${ROUTERS.USER.LOGIN}`);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /* ================= ORDER BADGE (GIỮ NGUYÊN) ================= */
  useEffect(() => {
    if (!user) return;

    const fetchPending = async () => {
      try {
        const res = await api.get("/admin/orders/pending/count");
        setPendingOrders(res.data.total || 0);
      } catch { }
    };

    fetchPending();
    const i = setInterval(fetchPending, 15000);
    return () => clearInterval(i);
  }, [user, setPendingOrders]);

  if (loading) return <p>Đang kiểm tra quyền truy cập...</p>;
  if (!user) return null;

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <h3>Admin Panel</h3>

        <ul>
          <li>
            <Link to={`/${ROUTERS.ADMIN.DASHBOARD}`}>Tổng quan</Link>
          </li>

          <li>
            <Link to={`/${ROUTERS.ADMIN.USER_MANAGEMENT}`}>
              Users
            </Link>
          </li>

          <li>
            <Link to={`/${ROUTERS.ADMIN.PRODUCT_MANAGEMENT}`}>
              Products
            </Link>
          </li>

          <li>
            <Link to={`/${ROUTERS.ADMIN.ORDER_MANAGEMENT}`}>
              Orders
              {pendingOrders > 0 && (
                <span className="admin-badge">{pendingOrders}</span>
              )}
            </Link>
          </li>

          {/* CHỈ THÊM – KHÔNG ẢNH HƯỞNG CÁI KHÁC */}
          <li
            className="noti-item"
            onClick={() => setShowNoti(!showNoti)}
          >
            🔔 Notifications
            {unreadCount > 0 && (
              <span className="admin-badge red">{unreadCount}</span>
            )}

            {showNoti && (
              <div className="noti-panel">
                <div className="noti-header">
                  <span >🔔 Thông báo</span>
                  {unreadCount > 0 && (
                    <span className="noti-count">{unreadCount} mới</span>
                  )}
                </div>

                <div className="noti-list">
                  {notifications.length === 0 && (
                    <div className="noti-empty">Không có thông báo</div>
                  )}

                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`noti-item-card ${!n.is_read ? "unread" : ""}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className="noti-icon">
                        {n.type === "cancel_request" ? "⚠️" : "📦"}
                      </div>

                      <div className="noti-content">
                        <div className="noti-message">{n.message}</div>
                        <div className="noti-time">
                          {new Date(n.created_at).toLocaleString("vi-VN")}
                        </div>
                      </div>

                      {!n.is_read && <span className="dot" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </li>

          <li className="divider" />

          <li>
            <Link to={`/${ROUTERS.USER.HOME}`}>← Về Shop</Link>
          </li>
        </ul>
      </nav>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
