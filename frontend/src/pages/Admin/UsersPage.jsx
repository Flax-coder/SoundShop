import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  getAdminUsers,
  toggleAdminUser,
  deleteUser,
} from "../../services/adminService";
import "./UsersPage.css";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

    const handleToggleAdmin = async (user) => {
        try {
            setActionLoading(`toggle-${user.id}`);

            await toggleAdminUser(user.id);

            toast.success(
            user.is_admin
                ? `${user.name} is no longer admin`
                : `${user.name} is now admin`
            );

            await fetchUsers();
        } catch (err) {
            console.error("Error updating user role:", err);

            toast.error(
            err?.response?.data?.message || "Unable to update user role."
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteUser = async (user) => {
        const confirmed = window.confirm(
            `Delete ${user.name}?`
        );

        if (!confirmed) return;

        await toast.promise(
            deleteUser(user.id),
            {
            loading: "Deleting user...",
            success: `${user.name} deleted`,
            error: "Error deleting user",
            }
        );

        await fetchUsers();
    };

  return (
    <div className="users-page">
      <div className="users-page-header">
        <span className="users-page-badge">Admin Area</span>
        <h1>Users</h1>
        <p>View and manage registered users of SoundShop.</p>
      </div>

      <div className="users-page-card">
        {loading ? (
          <p className="users-page-message">Loading users...</p>
        ) : error ? (
          <p className="users-page-error">{error}</p>
        ) : users.length === 0 ? (
          <p className="users-page-message">No users found.</p>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`user-role-badge ${
                          user.is_admin ? "admin" : "user"
                        }`}
                      >
                        {user.is_admin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("it-IT")
                        : "-"}
                    </td>
                    <td>
                    {currentUser?.id !== user.id ? (
                        <div className="users-actions">
                        <button
                            className="users-action-btn role-btn"
                            onClick={() => handleToggleAdmin(user)}
                            disabled={actionLoading === `toggle-${user.id}`}
                        >
                            {user.is_admin ? "Remove Admin" : "Make Admin"}
                        </button>

                        <button
                            className="users-action-btn delete-btn"
                            onClick={() => handleDeleteUser(user)}
                            disabled={actionLoading === `delete-${user.id}`}
                        >
                            Delete
                        </button>
                        </div>
                    ) : (
                        <span className="you-badge">👤 You</span>
                    )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersPage;