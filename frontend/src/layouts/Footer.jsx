import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h3>SoundShop</h3>
          <p>
            Modern gear store for guitarists and musicians.
            Discover amps, pedals and instruments.
          </p>
        </div>

        <div className="footer-links">
          <h4>Navigation</h4>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="footer-links">
          <h4>Shop</h4>
          <a href="#">Guitars</a>
          <a href="#">Amplifiers</a>
          <a href="#">Pedals</a>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Support</a>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} SoundShop — Built with React & Laravel
      </div>
    </footer>
  );
}

export default Footer;