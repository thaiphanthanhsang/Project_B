import { useEffect, useState, Fragment } from "react";
import api from "../../utils/api";
import { useAdminNotification } from "./AdminNotificationContext";
import "./theme/style.css";

const ORDER_STATUS = [
  "pending",
  "confirmed",
  "shipping",
  "completed",
  "cancelled",
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderItems, setOrderItems] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const { setPendingOrders } = useAdminNotification();

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching order list:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DETAIL ================= */
  const toggleDetail = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    if (!orderItems[orderId]) {
      try {
        const res = await api.get(`/admin/orders/${orderId}`);
        setOrderItems((prev) => ({
          ...prev,
          [orderId]: res.data.items,
        }));
      } catch {
        alert("Could not load order details");
        return;
      }
    }

    setExpandedOrderId(orderId);
  };

  /* ================= STATUS CHANGE ================= */
  const handleStatusChange = async (orderId, newStatus) => {
    const oldOrder = orders.find((o) => o.id === orderId);
    if (!oldOrder || oldOrder.status === newStatus) return;

    // NẾU CHỌN CANCELLED → HỦY ĐƠN LUÔN
    if (newStatus === "cancelled") {
      if (!window.confirm("Are you sure you want to CANCEL this order?")) {
        return;
      }

      try {
        setUpdatingStatus(orderId);

        await api.put(`/admin/orders/${orderId}/cancel`);

        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: "cancelled",
                  cancel_request: false,
                  cancel_by: "admin",
                }
              : o,
          ),
        );

        setPendingOrders((p) => Math.max(0, p - 1));

        alert("Order cancelled and stock restored successfully");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to cancel order");
      } finally {
        setUpdatingStatus(null);
      }

      return; //  RẤT QUAN TRỌNG
    }

    // CÁC TRẠNG THÁI KHÁC → UPDATE BÌNH THƯỜNG
    try {
      setUpdatingStatus(orderId);

      await api.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );

      const wasPending = ["pending", "confirmed"].includes(oldOrder.status);
      const nowPending = ["pending", "confirmed"].includes(newStatus);

      if (wasPending && !nowPending) {
        setPendingOrders((p) => Math.max(0, p - 1));
      }
      if (!wasPending && nowPending) {
        setPendingOrders((p) => p + 1);
      }
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  /* ================= CANCEL ORDER ================= */
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to CANCEL this order?")) return;

    try {
      await api.put(`/admin/orders/${orderId}/cancel`);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o)),
      );

      setPendingOrders((p) => Math.max(0, p - 1));

      alert("Order cancelled and stock restored successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="admin-page">
      <h2>Order Management</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <Fragment key={order.id}>
              {/* ===== MAIN ROW ===== */}
              <tr
                className={
                  order.status === "pending"
                    ? "order-row-pending"
                    : order.status === "confirmed"
                      ? "order-row-confirmed"
                      : order.status === "shipping"
                        ? "order-row-shipping"
                        : order.status === "cancelled"
                          ? "order-row-cancelled"
                          : ""
                }
              >
                <td>{order.id}</td>
                <td>{order.full_name}</td>
                <td>{order.phone}</td>
                <td>{Number(order.total_price).toLocaleString("en-US")}₫</td>

                <td>
                  <select
                    value={order.status}
                    disabled={
                      updatingStatus === order.id ||
                      ["cancelled", "completed"].includes(order.status)
                    }
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    {ORDER_STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>

                <td>{new Date(order.created_at).toLocaleString("en-US")}</td>

                <td style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn-edit"
                    onClick={() => toggleDetail(order.id)}
                  >
                    {expandedOrderId === order.id ? "Hide" : "Details"}
                  </button>

                  {["pending", "confirmed"].includes(order.status) && (
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>

              {/* ===== DETAIL ROW ===== */}
              {expandedOrderId === order.id && (
                <tr>
                  <td colSpan={7}>
                    <table className="admin-table sub-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Color</th>
                          <th>Size</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(orderItems[order.id] || []).map((item) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.color || "-"}</td>
                            <td>{item.size || "-"}</td>
                            <td>{item.quantity}</td>
                            <td>
                              {Number(item.price).toLocaleString("en-US")}₫
                            </td>
                            <td>
                              {(item.price * item.quantity).toLocaleString(
                                "en-US",
                              )}
                              ₫
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersPage;
