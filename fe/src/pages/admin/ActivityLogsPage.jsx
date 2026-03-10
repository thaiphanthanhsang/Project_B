import { useState, useEffect } from "react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

const ActivityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Extra safety: only superadmin should even try to fetch
    if (user?.role === "superadmin") {
      fetchLogs();
    } else {
      setError("You do not have permission to access this page.");
      setLoading(false);
    }
  }, [user]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/activities");
      setLogs(res.data);
    } catch (err) {
      console.error("Error loading history:", err);
      setError("Unable to load activity history.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "HH:mm, MMM dd, yyyy", {
        locale: enUS,
      });
    } catch {
      return dateString;
    }
  };

  const getActionColor = (action) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("created")) return "#10b981"; // green
    if (actionLower.includes("deleted")) return "#ef4444"; // red
    if (actionLower.includes("updated")) return "#3b82f6"; // blue
    return "#64748b"; // gray
  };

  if (loading) return <p>Loading activity history...</p>;

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Admin Activity Logs</h2>
      </div>

      {logs.length === 0 ? (
        <p className="text-gray-500">No activity logs recorded yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Admin Name</th>
              <th>Role</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td style={{ whiteSpace: "nowrap" }}>
                  {formatDate(log.created_at)}
                </td>
                <td>
                  <div style={{ fontWeight: "500" }}>{log.admin_name}</div>
                  <div style={{ fontSize: "0.85em", color: "#666" }}>
                    {log.admin_email}
                  </div>
                </td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.85em",
                      fontWeight: "bold",
                      backgroundColor:
                        log.admin_role === "superadmin" ? "#fcd34d" : "#e0e7ff",
                      color:
                        log.admin_role === "superadmin" ? "#92400e" : "#3730a3",
                    }}
                  >
                    {log.admin_role}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      backgroundColor: getActionColor(log.action),
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.85em",
                      fontWeight: "600",
                    }}
                  >
                    {log.action}
                  </span>
                </td>
                <td style={{ maxWidth: "300px", wordWrap: "break-word" }}>
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ActivityLogsPage;
