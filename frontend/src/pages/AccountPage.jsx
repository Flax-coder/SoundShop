import { useEffect, useState } from "react";
import api from "../services/api";
import "./AccountPage.css";

function AccountPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const token = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };

        const [profileRes, ordersRes] = await Promise.all([
          api.get("http://127.0.0.1:8000/api/user/profile", { headers }),
          api.get("http://127.0.0.1:8000/api/user/orders", { headers }),
        ]);

        setUser(profileRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error("Errore caricamento account:", err);
        setError("Unable to load your account data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  if (loading) {
    return (
      <div className="account-page">
        <div className="account-container">
          <p className="account-message">Loading account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-page">
        <div className="account-container">
          <p className="account-message error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-container">
        <div className="account-header">
          <span className="account-badge">My Account</span>
          <h1>Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
          <p>
            Here you can view your profile details and check your recent orders.
          </p>
        </div>

        <div className="account-grid">
          <section className="account-card profile-card">
            <h2>Profile details</h2>

            <div className="account-info-row">
              <span>Name</span>
              <strong>{user?.name || "-"}</strong>
            </div>

            <div className="account-info-row">
              <span>Email</span>
              <strong>{user?.email || "-"}</strong>
            </div>

            <div className="account-info-row">
              <span>User ID</span>
              <strong>{user?.id || "-"}</strong>
            </div>

            <div className="account-info-row">
              <span>Member since</span>
              <strong>
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "-"}
              </strong>
            </div>
          </section>

          <section className="account-card orders-card">
            <div className="orders-header">
              <h2>My orders</h2>
              <span className="orders-count">{orders.length} orders</span>
            </div>

            {orders.length === 0 ? (
              <div className="empty-orders">
                <p>You have no orders yet.</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div className="order-box" key={order.id}>
                    <div className="order-top">
                      <div>
                        <h3>Order #{order.id}</h3>
                        <p>
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString()
                            : "No date"}
                        </p>
                      </div>

                      <span
                        className={`order-status status-${order.status?.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="order-middle">
                      <p>
                        <strong>Total:</strong> €{" "}
                        {Number(order.total_price).toFixed(2)}
                      </p>
                      <p>
                        <strong>Shipping:</strong>{" "}
                        {[
                          order.shipping_address,
                          order.shipping_city,
                          order.shipping_zip,
                          order.shipping_country,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Not provided"}
                      </p>
                    </div>

                    <div className="order-items">
                      <h4>Items</h4>

                      {order.items && order.items.length > 0 ? (
                        <ul>
                          {order.items.map((item) => (
                            <li key={item.id}>
                              <span>
                                {item.product?.name || "Product"} x {item.quantity}
                              </span>
                              <strong>€ {Number(item.price).toFixed(2)}</strong>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-items">No items found for this order.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;