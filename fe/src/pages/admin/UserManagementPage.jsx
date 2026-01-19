import { useState, useEffect } from "react";
import api from "../../utils/api.js";
import UserFormModal from "./UserFormModal.jsx";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách user:", err);
    }
    setLoading(false);
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditFormData(user);
  };

  const handleCancelClick = () => {
    setEditingUserId(null);
    setEditFormData({});
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveClick = async (userId) => {
    try {
      const response = await api.put(`/users/${userId}`, editFormData);
      setUsers(
        users.map((user) => (user.id === userId ? response.data : user))
      );
      setEditingUserId(null);
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (err) {
        alert("Xóa thất bại!");
      }
    }
  };

  const handleCreate = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleSaveUser = (savedUser) => {
    if (currentUser === null) {
      setUsers([...users, savedUser]);
    }
  };

  if (loading) return <p>Đang tải danh sách...</p>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Quản lý Người dùng</h2>
        <div className="admin-header-actions">
          <button className="btn-primary" onClick={handleCreate}>
            + Thêm User
          </button>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              {editingUserId === user.id ? (
                <>
                  <td>{user.id}</td>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditFormChange}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditFormChange}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="phone"
                      value={editFormData.phone || ""}
                      onChange={handleEditFormChange}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>
                    <select
                      name="role"
                      value={editFormData.role}
                      onChange={handleEditFormChange}
                      style={{ width: "100%" }}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleSaveClick(user.id)}
                      className="btn-save"
                    >
                      Lưu
                    </button>
                    <button onClick={handleCancelClick} className="btn-cancel">
                      Hủy
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "N/A"}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      onClick={() => handleEditClick(user)}
                      className="btn-edit"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn-delete"
                    >
                      Xóa
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={currentUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserManagementPage;
