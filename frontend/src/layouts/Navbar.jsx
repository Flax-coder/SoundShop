import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
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

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
            >
              Cart
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;