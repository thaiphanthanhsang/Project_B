import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "../../../utils/api";
import { Container } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    // Modal states
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelOrderId, setCancelOrderId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders/my");
            setOrders(res.data);
        } catch {
            navigate("/login");
        }
    };

    const openCancelModal = (id) => {
        setCancelOrderId(id);
        setCancelReason("");
        setShowCancelModal(true);
    };

    const closeCancelModal = () => {
        if (isSubmitting) return;
        setShowCancelModal(false);
        setCancelReason("");
        setCancelOrderId(null);
    };

    const submitCancelRequest = async () => {
        if (!cancelReason || !cancelReason.trim()) {
            alert("Vui lòng nhập lý do hủy");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.put(`/orders/${cancelOrderId}/request-cancel`, { reason: cancelReason });
            alert("Đã gửi yêu cầu hủy, chờ admin duyệt");
            closeCancelModal();
            await fetchOrders();
        } catch (err) {
            console.error(err);
            alert("Không thể gửi yêu cầu hủy");
        } finally {
            setIsSubmitting(false);
        }
    };

    // HÀM HIỂN THỊ TRẠNG THÁI
    const renderStatus = (order) => {
        const { status, cancel_request, cancel_by } = order;

        if (status === "cancelled" && cancel_by === "admin") {
            return <span style={{ color: "red" }}>cancelled (Đã hủy đơn)</span>;
        }

        if (cancel_request) {
            return <span style={{ color: "orange" }}>{status} (Đang chờ hủy)</span>;
        }

        if (status === "completed") {
            return <span style={{ color: "green" }}>{status} (Đã hoàn tất)</span>;
        }

        switch (status) {
            case "pending":
                return "pending (Chờ xác nhận)";
            case "confirmed":
                return "confirmed (Đã xác nhận)";
            case "shipping":
                return "shipping (Đang giao hàng)";
            case "cancelled":
                return "cancelled";
            default:
                return status;
        }
    };

    return (

        <div className="container py-4">

            <h2><Container size={24} style={{ marginRight: "10px" }} /> Đơn hàng của tôi</h2>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Ngày</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((o) => (
                        <tr key={o.id}>
                            <td>{o.id}</td>
                            <td>{new Date(o.created_at).toLocaleString("vi-VN")}</td>
                            <td>{Number(o.total_price).toLocaleString("vi-VN")}₫</td>
                            <td>{renderStatus(o)}</td>
                            <td>
                                {["pending", "confirmed"].includes(o.status) &&
                                    !o.cancel_request && (
                                        <button
                                            className="btn-warning"
                                            onClick={() => openCancelModal(o.id)}
                                        >
                                            Yêu cầu hủy
                                        </button>
                                    )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* MODAL — PORTAL */}
            {showCancelModal &&
                createPortal(
                    <div
                        className="modal-overlay"
                        onClick={closeCancelModal}
                        aria-modal="true"
                        role="dialog"
                    >
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Yêu cầu hủy đơn #{cancelOrderId}</h3>
                            </div>

                            <div className="modal-body">
                                <label className="label">Lý do hủy</label>
                                <textarea
                                    className="textarea"
                                    rows={4}
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Nhập lý do yêu cầu hủy..."
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="btn-secondary"
                                    onClick={closeCancelModal}
                                    disabled={isSubmitting}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="btn-primary"
                                    onClick={submitCancelRequest}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default MyOrders;
