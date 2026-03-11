import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <span className="admin-badge">Admin Area</span>
          <h1>Dashboard Admin</h1>
          <p>
            Manage the main sections of SoundShop from one central place.
          </p>
        </div>

        <div className="admin-grid">
          <Link to="/admin/users" className="admin-card">
            <div className="admin-icon">👤</div>
            <h2>Users</h2>
            <p>View and manage registered users.</p>
          </Link>

          <Link to="/admin/categories" className="admin-card">
            <div className="admin-icon">🏷️</div>
            <h2>Categories</h2>
            <p>Create, edit and organize product categories.</p>
          </Link>

          <Link to="/admin/products" className="admin-card">
            <div className="admin-icon">🎸</div>
            <h2>Products</h2>
            <p>Manage product catalog, details and pricing.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;