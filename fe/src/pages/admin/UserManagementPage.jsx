import { useState, useEffect } from "react";
import api from "../../utils/api.js";
import UserFormModal from "./UserFormModal.jsx";
import ConfirmationModal from "../../components/common/ConfirmationModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const UserManagementPage = () => {
  const { user: loggedInUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
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
        users.map((user) => (user.id === userId ? response.data : user)),
      );
      setEditingUserId(null);
    } catch (err) {
      console.error(err);
      alert("Update failed!");
    }
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/users/${userToDelete}`);
      setUsers(users.filter((user) => user.id !== userToDelete));
    } catch (error) {
      console.error(error);
      alert("Delete failed!");
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
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

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>User Management</h2>
        <div className="admin-header-actions">
          <button className="btn-primary" onClick={handleCreate}>
            + Add User
          </button>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
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
                      {loggedInUser?.role === "superadmin" && (
                        <option value="superadmin">superadmin</option>
                      )}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleSaveClick(user.id)}
                      className="btn-save"
                    >
                      Save
                    </button>
                    <button onClick={handleCancelClick} className="btn-cancel">
                      Cancel
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
                    {(loggedInUser?.role === "superadmin" ||
                      user.role !== "superadmin") && (
                      <button
                        onClick={() => handleEditClick(user)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                    )}
                    {(loggedInUser?.role === "superadmin" ||
                      user.role === "user") && (
                      <button
                        onClick={() => handleDeleteClick(user.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    )}
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

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default UserManagementPage;
