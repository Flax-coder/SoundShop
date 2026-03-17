import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaShoppingCart } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="site-header">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            SoundShop
          </Link>

          <div className="navbar-links">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
            >
              Products
            </NavLink>

            {!isAuthenticated && (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "navbar-link active" : "navbar-link"
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? "navbar-link active" : "navbar-link"
                  }
                >
                  Register
                </NavLink>
              </>
            )}

            {isAuthenticated && (
              <div className="navbar-account-wrapper" ref={accountMenuRef}>
                <button
                  type="button"
                  className="navbar-account-trigger"
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                >
                  Welcome back, {user?.name} {isAdmin && "👑"} <span className="dropdown-arrow">▼</span>
                </button>

                {accountMenuOpen && (
                  <div className="navbar-account-dropdown">
                    <Link
                      to="/account"
                      className="navbar-dropdown-item"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      My account
                    </Link>

                    <Link
                      to="/products/create"
                      className="navbar-dropdown-item"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      ➕ Create product
                    </Link>

                    <Link
                      to="/my-products"
                      className="navbar-dropdown-item"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      My products
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="navbar-dropdown-item"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Admin dashboard
                      </Link>
                    )}

                    <button
                      type="button"
                      className="navbar-dropdown-item logout-item"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {isAuthenticated && (
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  isActive ? "navbar-link active" : "navbar-link"
                }
              >
                <FaShoppingCart className="cart-icon" />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;